import { Injectable } from '@nestjs/common';
import { SumFold } from 'common/collection.util';
import { LiquidDeploymentDTO } from 'common/dto/liquid-deployment.dto';
import { StepType } from 'common/enums';
import { DatabaseService, SteppedProtocol } from './db.service';
import {
    liquidConfigToMap,
    ProtocolDeploymentService,
} from './protocol-deployment.service';
import tonesConfig from 'common/new-tones-config.json';

@Injectable()
export class ProtocolStepsResolver {
    constructor(private readonly dbService: DatabaseService) {}

    async resolveProtocolSteps(id: number): Promise<any> {
        const protocol = await this.dbService.getProtocolById(id);
        return {
            id: protocol.id,
            steps: this.getSteps(protocol),
            default_wash: {
                iters: protocol.defaultWashing.iter,
                incubation: protocol.defaultWashing.incubationTime,
            },
        };
    }

    private getSteps(protocol: SteppedProtocol): any[] {
        const steps: any[] = [];
        protocol.steps.forEach((step) => {
            if (step.stepType === StepType.WASHING) {
                steps.push({
                    type: StepType.WASHING,
                });
            }
            if (step.stepType === StepType.LIQUID_APPL) {
                steps.push({
                    type: 'Reagent',
                    incubation: step.liquidApplication.liquidIncubationTime,
                    temperature: step.liquidApplication.incubationTemperature,
                    position:
                        step.liquidApplication.liquidInfo.permanentLiquid
                            .position,
                });
                //Add wash step if auto_wash
            }
        });
        return steps;
    }
}
