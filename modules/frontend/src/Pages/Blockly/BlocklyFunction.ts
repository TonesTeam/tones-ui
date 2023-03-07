
import Blockly, { Block, BlockSvg, Connection } from 'blockly';
import { List, Set } from 'immutable';
import { WorkspaceSvg } from 'react-blockly';
import 'blockly/python';
import { Input } from 'blockly';
import { getComparator } from 'sharedlib/collection.util'


class FunctionBlock extends Block {
    argCount: number | undefined;
    argmap: Map<ArgBlock, Block> | undefined
}

class ArgBlock extends BlockSvg {
    placeholder: string | undefined;
    order: number | undefined;
}

class FunctionBlockStateArg {
    type: string;
    order: number;

    constructor(b: Block) {
        this.type = b.type;
        this.order = parseInt(b.getField("Arg Count")?.getValue());
    }
}

Blockly.Blocks['function_args'] = {
    init: function (this: Block) {
        this.appendDummyInput()
            .appendField("Function arguments:");
        this.appendStatementInput("function_args")
            .setCheck(null);
        this.setColour(230);
    }
}

Blockly.Blocks['liquid_type_arg'] = {
    init: function (this: ArgBlock) {
        this.placeholder = "liquid_type_arg_placeholder";
        this.setCommentText("liq arg");
        this.appendDummyInput()
            .appendField("Liquid Type")
            .appendField("", "order");
        this.setColour(290);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
}

Blockly.Blocks['number_arg'] = {
    init: function (this: ArgBlock) {
        this.placeholder = "number_arg_placeholder";
        this.setCommentText("num arg");
        this.appendDummyInput()
            .appendField("Number")
            .appendField("", "order");
        this.setColour(290);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
}

////////////////////////
Blockly.Blocks['liquid_type_arg_placeholder'] = {
    init: function (this: Block) {
        this.appendDummyInput()
            .appendField("", "Arg Count")
            .appendField("(Liquid Type)")
        this.setColour(290);
        this.setOutput(true, null);
    }
}

Blockly.Blocks['number_arg_placeholder'] = {
    init: function (this: Block) {
        this.appendDummyInput()
            .appendField("", "Arg Count")
            .appendField("(Number Arg)")
        this.setColour(290);
        this.setOutput(true, null);
    }
}
////////////////////////

function addArgumentInputToBlock(block: Block, placeHolderArgBlock: BlockSvg) {
    const argName = placeHolderArgBlock.id;
    block.appendValueInput(argName).setCheck(block.type);
    block.moveInputBefore(argName, "function_content");
    const inp = block.getInput(argName);
    inp?.connection.connect(placeHolderArgBlock.outputConnection as Connection);
    placeHolderArgBlock.setDeletable(false);
}

function getArgBlocks(block: Block): List<ArgBlock> {
    if (block.getChildren(true).length == 0) {
        return List();
    }
    const ch = block.getChildren(true)[0];
    return getArgBlocks(ch).unshift(ch as ArgBlock);
}

Blockly.Blocks['function_block'] = {
    init: function (this: FunctionBlock) {
        this.argmap = new Map;
        this.appendDummyInput("start")
            .appendField("Function:")
            .appendField(new Blockly.FieldTextInput("name"), "function_name");
        this.appendStatementInput("function_content")
            .setCheck(null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
        const mutator = new Blockly.Mutator(['liquid_type_arg', 'number_arg']);
        this.setMutator(mutator);
        this.argCount = 0;
    },

    decompose: function (this: FunctionBlock, workspace: Blockly.Workspace) {
        var containerBlock = workspace.newBlock('function_args') as BlockSvg;
        containerBlock.initSvg();
        const svgWorkspace = workspace as WorkspaceSvg
        let connection = containerBlock.getInput("function_args")?.connection!;
        List(this.argmap?.keys()).sortBy(b => b.order).forEach(arg => {
            const placeholderBlock = this.argmap?.get(arg)!
            const newArgBlock = svgWorkspace.newBlock(arg.type) as ArgBlock
            connection.connect(newArgBlock.previousConnection as Connection);
            connection = newArgBlock.nextConnection as Connection;
            newArgBlock.initSvg();
            newArgBlock.render();
            this.argmap?.delete(arg);
            this.argmap?.set(newArgBlock, placeholderBlock);
        });
        containerBlock.render();
        return containerBlock;
    },

    compose: function (this: FunctionBlock, topBlock: Block) {
        const listArgs = getArgBlocks(topBlock)
        const args = Set(listArgs);
        const svgWorkspace = this.workspace as WorkspaceSvg;
        const intersection = args.intersect(Set(this.argmap?.keys()));
        List(this.argmap?.keys()).filterNot(e => intersection.contains(e)).forEach(el => {
            const placeHolder = this.argmap?.get(el)!;
            placeHolder.dispose(false);
            if (this.getInput(placeHolder.id) != undefined) {
                this.removeInput(placeHolder.id);
            }
            this.argmap?.delete(el);
        });
        List(args).filterNot(e => intersection.contains(e)).forEach(el => {
            const placeHolderArgBlock = svgWorkspace.newBlock(el.placeholder!);
            addArgumentInputToBlock(this, placeHolderArgBlock)
            placeHolderArgBlock.initSvg();
            placeHolderArgBlock.render();
            this.argmap?.set(el, placeHolderArgBlock as Block);
        });
        this.argmap?.values()
        for (let i = 0; i < listArgs.size; i++) {
            const k = listArgs.get(i)!
            k.order = i;
            k.getField("order")?.setValue(i);
            this.argmap?.get(k)?.getField("Arg Count")?.setValue(i.toString());
        }
    },

    saveExtraState: function (this: FunctionBlock) {
        const args = List(this.argmap?.values()).map(e => new FunctionBlockStateArg(e))
        return { 'args': args }
    },

    loadExtraState: function (state: any) {
        const args = state['args'] as FunctionBlockStateArg[];
        const svgWorkspace = this.workspace as WorkspaceSvg;
        args.sort(getComparator(b => b.order)).forEach(arg => {
            const newArgPlaceHolder = svgWorkspace.newBlock(arg.type);
            addArgumentInputToBlock(this, newArgPlaceHolder);
            newArgPlaceHolder.getField('Arg Count')?.setValue(arg.order);
        });
    }
}


function getDropDownOptions() {
    const dropDown = [["function_name", "function_name"]];
    if (Blockly.getMainWorkspace() === undefined) {
        return dropDown;
    }
    const functions = Blockly.getMainWorkspace().getBlocksByType("function_block", false).map(b => b.getFieldValue("function_name")).map(a => [a, a]);
    functions.forEach(f => dropDown.push(f));
    return dropDown;
}

function dropdownOptionValidator(funcCall: Block, value: string) {
    if (value === "function_name") {
        funcCall.inputList.filter(i => i.name.startsWith("arg_")).forEach(i => i.dispose())
    }
    const func = funcCall.workspace.getBlocksByType("function_block", false)
        .filter(fb => fb.getFieldValue("function_name") === value)
        .at(0);
    for (let i = 0; i < func?.inputList.length! - 2; i++) {
        funcCall.appendValueInput(`arg_${i}`);
    }
    return value;
}

Blockly.Blocks['function_call'] = {
    init(this: Block) {
        this.appendDummyInput()
            .appendField("Call")
            .appendField(new Blockly.FieldDropdown(getDropDownOptions, (v: string) => dropdownOptionValidator(this, v)), "reagent");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(190);
    }
}
