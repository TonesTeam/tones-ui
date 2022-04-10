
import Blockly, { Block, BlockSvg, Connection, Input } from 'blockly';
import 'blockly/python';

interface CodeGenerator {
    [index: string]: (b: Block) => string | [string, any];
}

interface PythonContainer {
    Python: CodeGenerator;
}

const PyGen = (Blockly as unknown as PythonContainer).Python

PyGen['apply_liquid'] = function (block: Block) {
    var number_volume = block.getFieldValue('volume');
    var dropdown_liquid = block.getFieldValue('liquid');
    var number_time = block.getFieldValue('time');
    var number_degrees = block.getFieldValue('degrees');
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['apply_parafinization_liquid'] = function (block: Block) {
    var number_volume = block.getFieldValue('volume');
    var dropdown_liquid = block.getFieldValue('liquid');
    var number_time = block.getFieldValue('time');
    var number_degrees = block.getFieldValue('degrees');
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['apply_washing_liquid'] = function (block: Block) {
    var number_volume = block.getFieldValue('volume');
    var dropdown_liquid = block.getFieldValue('liquid');
    var number_time = block.getFieldValue('time');
    var number_degrees = block.getFieldValue('degrees');
    var number_times = block.getFieldValue('times');
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['wait'] = function (block: Block) {
    var number_time = block.getFieldValue('time');
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['set_temperature'] = function (block: Block) {
    var number_name = block.getFieldValue('NAME');
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['repeat'] = function (block: Block) {
    var number_times = block.getFieldValue('times');
    var statements_name = (Blockly as any).Python.statementToCode(block, 'NAME');
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['begin_protocol'] = function (block: Block) {
    var text_protocol_name = block.getFieldValue('protocol_name');
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['normalize_temperature'] = function (block: Block) {
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['set_normal_temp'] = function (block: Block) {
    var number_name = block.getFieldValue('NAME');
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['apply_reagent_2'] = function (block) {
    var value_volume = (Blockly as any).Python.valueToCode(block, 'volume', (Blockly as any).Python.ORDER_ATOMIC);
    var value_reagent = (Blockly as any).Python.valueToCode(block, 'reagent', (Blockly as any).Python.ORDER_ATOMIC);
    var value_time = (Blockly as any).Python.valueToCode(block, 'time', (Blockly as any).Python.ORDER_ATOMIC);
    var value_degree = (Blockly as any).Python.valueToCode(block, 'degree', (Blockly as any).Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

PyGen['reagent_type'] = function (block) {
    var dropdown_reagent = block.getFieldValue('reagent');
    // TODO: Assemble Python into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, (Blockly as any).Python.ORDER_NONE];
};


export function GenerateAll() {
    for (const [key, val] of Object.entries(Blockly.Blocks)) {
        if (PyGen[key] === undefined)
            PyGen[key] = (b: Block) => ""
    }
}