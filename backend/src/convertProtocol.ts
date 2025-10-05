// This is where we convert the JSON that the we get from the database
// into a format that the controller wants.
//
// Careful, the following info might be outdated!
//
// Currently we get steps with the following format:
// {
//     "type": "Reagent",
//     "incubation": 5,
//     "temperature": 25,
//     "position": 5
// }
//
// And the controller wants:
// {
//     command_type: 1,
//     message: 'Delay 3',
//     protocol_id: 169,
//     task_id: 269,
//     data: 6069,
//     temperature: 2000,
//     time: 15,
//     wash_reps: 2,
//     slot_selector_pos: 4,
//     reagent_pos: 3,
//     slot_sensor_id: 1,
// }

const convertProtocolStep = (step: any) => {
    return {
        command_type: 1, // just go for command_type 1
        message: '=)', // a message for logs
        protocol_id: 169, // just use protocol id
        task_id: 269, // non needed
        data: 6069, // non needed
        temperature: step.temperature,
        time: step.incubation,
        wash_reps: 2,
        slot_selector_pos: 4, // slot number
        reagent_pos: step.position, // the id number of the connector in the selector of the reagent
        slot_sensor_id: 1, // non needed
    };
};

export default convertProtocolStep;
