import { Injectable, Logger } from '@nestjs/common';
import { ProtocolStepsResolver } from './protocol-steps-resolver.service';

@Injectable()
export class EmbeddedControllerService {
    private readonly controllerAddress = 'http://127.0.0.1:3000';
    private readonly logger = new Logger(EmbeddedControllerService.name);

    constructor(private readonly stepsResolver: ProtocolStepsResolver) {}

    async sendProtocolForExecution(id: number) {
        const prot = await this.stepsResolver.resolveProtocolSteps(id);
        console.log(JSON.stringify(prot));

        const steps = prot.steps;
        for (let i = 0; i < steps.length; i++) {
            const convertedStep = this.convertProtocolStep(steps[i]);
            console.log(
                `Sending step ${i + 1}: ${JSON.stringify(convertedStep)}`,
            );

            try {
                const response = await fetch(`${this.controllerAddress}/data`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(convertedStep),
                });

                if (!response.ok) {
                    throw new Error(
                        `Step ${i + 1} failed with ${response.status}`,
                    );
                }

                this.logger.log(`✅ Step ${i + 1} sent successfully`);
            } catch (e) {
                this.logger.error(`❌ Failed to send step ${i + 1}: ${e}`);
                throw e;
            }
        }
    }

    async getSlotStatus() {
        try {
            const response = await fetch(
                `${this.controllerAddress}/slot-status`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            if (!response.ok) {
                throw new Error(`Failed with ${response.status}`);
            }

            const data = await response.json();
            this.logger.log(`✅ Slot status retrieved successfully`);
            return data;
        } catch (e) {
            this.logger.error(`❌ Failed to retrieve slot status: ${e}`);
            throw e;
        }
    }

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

    convertProtocolStep(step: any) {
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
    }
}
