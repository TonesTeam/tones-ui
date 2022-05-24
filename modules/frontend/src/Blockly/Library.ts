import Blockly, { Block } from 'blockly';
import 'blockly/python';
import { getRequest, groupBy } from 'common/util';
import './BlocklyFunction'
import { LiquidDto } from "sharedlib/dto/liquid.dto"

const liquids = (await getRequest<LiquidDto[]>("/liquids")).data;
const typesMap = groupBy(liquids, l => l.type, l => l.name);
console.log(typesMap);
const reagents = typesMap.get("Reagent")?.map(r => [r, r])
const antigens = typesMap.get("Antigen retrieval")?.map(r => [r, r])!

function createLabel(text: string, clazz: string) {
    return new Blockly.FieldLabel(text, clazz, undefined);
}

Blockly.Blocks['reagent_type'] = {
    init: function (this: Block) {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["reagent_type_1", "reagent_type_1"], ["reagent_type_2", "reagent_type_2"], ["reagent_type_3", "reagent_type_3"]]), "reagent");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["reagent_1", "reagent_1"], ["reagent_2", "reagent_2"], ["reagent_3", "reagent_3"]]), "reagent");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
}

Blockly.Blocks['apply_reagent_2'] = {
    init: function (this: Block) {
        const newBlock = this.workspace.newBlock('math_number')
        // this.getInput("volume")?.connection.connect(newBlock.nextConnection)
        this.setInputsInline(true);
        this.appendValueInput("volume")
            .setCheck("Number")
            .appendField("Reagent:")
        // ?.connection.connect(newBlock.outputConnection);
        this.appendValueInput("reagent")
            .setCheck("reagent_type")
            .appendField("units of");
        this.appendValueInput("time")
            .setCheck("Number")
            .appendField("for");
        this.appendDummyInput()
            .appendField("minutes at");
        this.appendValueInput("degree")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("°C");
        this.setColour(90);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        // Blockly.Extensions.apply('my_fill_default_fields', this, false)
    }
};

Blockly.Blocks['apply_reagent_3'] = {
    init: function (this: Block) {
        // this.setMutator(new Blockly.Mutator(['math_number']));
        const newBlock = this.workspace.newBlock('math_number')
        // this.getInput("volume")?.connection.connect(newBlock.nextConnection)
        this.setInputsInline(false);
        this.appendValueInput("reagent")
            .setCheck("reagent_type")
            .appendField("Reagent:")
        // ?.connection.connect(newBlock.outputConnection);
        this.appendValueInput("times")
            .setCheck("Number")
            .appendField("Times:");
        this.appendValueInput("degree")
            .setCheck("Number")
            .appendField("At Degrees °C:");
        this.setColour(90);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        // Blockly.Extensions.apply('my_fill_default_fields', this, false)
    }

};

Blockly.Blocks['set_normal_temp'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Set standard temperature to")
            .appendField(new Blockly.FieldNumber(0), "NAME")
            .appendField("°C");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['apply_liquid'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(createLabel("Reagent:", "boldit"))
            .appendField("From")
            .appendField(new Blockly.FieldDropdown([["reagent_type_1", "reagent_type_1"], ["reagent_type_2", "reagent_type_2"], ["reagent_type_3", "reagent_type_3"]]), "reagent");
        this.appendDummyInput()
            .appendField("apply")
            .appendField(new Blockly.FieldDropdown([["reagent_1", "reagent_1"], ["reagent_2", "reagent_2"], ["reagent_3", "reagent_3"]]), "reagent")
            .appendField("for")
            .appendField(new Blockly.FieldNumber(0), "time")
            .appendField("minutes.")
        this.appendDummyInput()
            .appendField("Times - ")
            .appendField(new Blockly.FieldNumber(1), "times")
            .appendField(".")
            .appendField("At")
            .appendField(new Blockly.FieldNumber(0), "degrees")
            .appendField("°C")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['apply_parafinization_liquid'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(createLabel("Deparafinization: ", "boldit"))
            .appendField("Apply")
        this.appendDummyInput()
            .appendField("dewax solution for")
            .appendField(new Blockly.FieldNumber(0), "time")
            .appendField("minutes.")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['apply_washing_liquid'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(createLabel("Washing: ", "boldit"))
            .appendField(new Blockly.FieldDropdown([["liquid_1", "liquid_1"], ["liquid_2", "liquid_2"], ["liquid_3", "liquid_3"]]), "liquid");
        this.appendDummyInput()
            .appendField("for")
            .appendField(new Blockly.FieldNumber(0), "time")
            .appendField("minutes. Times - ")
            .appendField(new Blockly.FieldNumber(1), "times");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['apply_antigen_liquid'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(createLabel("Antigen retrieval: ", "boldit"))
            .appendField("Apply")
            .appendField(new Blockly.FieldDropdown(antigens), "liquid");
        this.appendDummyInput()
            .appendField("for")
            .appendField(new Blockly.FieldNumber(0), "time")
            .appendField("minutes.")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['apply_blocking_liquid'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(createLabel("Blocking:", "boldit"))
            .appendField("Apply")
            .appendField(new Blockly.FieldDropdown([["liquid_1", "liquid_1"], ["liquid_2", "liquid_2"], ["liquid_3", "liquid_3"]]), "liquid");
        this.appendDummyInput()
            .appendField("for")
            .appendField(new Blockly.FieldNumber(0), "time")
            .appendField("minutes.")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(110);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['wait'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Wait for")
            .appendField(new Blockly.FieldNumber(0), "time")
            .appendField("minutes");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['set_temperature'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Change temperature to")
            .appendField(new Blockly.FieldNumber(0), "NAME")
            .appendField("°C");
        this.appendDummyInput()
            .appendField("Wait:")
            .appendField(new Blockly.FieldCheckbox("TRUE", undefined, undefined), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['repeat'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Repeat, times")
            .appendField(new Blockly.FieldNumber(1), "times");
        this.appendStatementInput("NAME")
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['begin_protocol'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Protocol:")
            .appendField(new Blockly.FieldTextInput("protocol_name"), "protocol_name");
        this.appendDummyInput()
            .appendField("Type:")
            .appendField(new Blockly.FieldDropdown([["type_1", "type_1"], ["type_2", "type_2"], ["type_3", "type_3"]]), "type_1")
        this.appendDummyInput()
            .appendField("Standard temp: ")
            .appendField(new Blockly.FieldNumber(12), "temp")
            .appendField("°C");
        this.appendStatementInput("protocol_content");
        // this.setNextStatement(true, null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['normalize_temperature'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Normalize temperature");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Changes temperature to room temp or standard temp (if set)");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['wait'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Wait for")
            .appendField(new Blockly.FieldNumber(0), "wait_time")
            .appendField("minutes")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(288);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
