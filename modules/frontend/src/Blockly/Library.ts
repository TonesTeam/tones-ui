import Blockly, { Block } from 'blockly';
import 'blockly/python';

function createLabel(text: string, clazz: string) {
    return new Blockly.FieldLabel(text, clazz, undefined);
}

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
            .appendField(createLabel("Reagent: ", "boldit"))
            .appendField(new Blockly.FieldNumber(0), "volume")
            .appendField("ml of ")
            .appendField(new Blockly.FieldDropdown([["reagent_1", "reagent_1"], ["reagent_2", "reagent_2"], ["reagent_3", "reagent_3"]]), "reagent");
        this.appendDummyInput()
            .appendField("for")
            .appendField(new Blockly.FieldNumber(0), "time")
            .appendField("minutes at ")
            .appendField(new Blockly.FieldNumber(0), "degrees")
            .appendField("°C");
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
            .appendField(new Blockly.FieldNumber(0), "volume")
            .appendField("ml of")
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
            .appendField(new Blockly.FieldNumber(0), "volume")
            .appendField("ml of")
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
        this.setNextStatement(true, null);
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

interface CodeGenerator {
    [index: string]: (b: Block) => string;
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
