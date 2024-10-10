import { Injectable } from "@nestjs/common";
import { SumFold } from "sharedlib/collection.util";
import { LiquidDeploymentDTO } from "sharedlib/dto/liquid-deployment.dto";
import { StepType } from "sharedlib/enum/DBEnums";
import { DatabaseService, SteppedProtocol } from "./db.service";
import { liquidConfigToMap, ProtocolDeploymentService } from "./protocol-deployment.service";
import tonesConfig from "sharedlib/new-tones-config.json";


@Injectable()
export class ProtocolStepsResolver {

    constructor(
        private readonly dbService: DatabaseService,
        private readonly deploymentService: ProtocolDeploymentService
    ) { }

    async resolveProtocolSteps(id: number): Promise<any> {
        const prot = await this.dbService.getProtocolById(id);
        const depl = await this.deploymentService.deployProtocol(id);
        return {
            id: prot.id,
            steps: this.getSteps(prot, depl),
            default_wash: {
                iters: prot.defaultWashing.iter,
                incubation: prot.defaultWashing.incubationTime,
            }
        };
    }

    private getSteps(prot: SteppedProtocol, depl: LiquidDeploymentDTO[]): any[] {
        const steps: any[] = [];
        prot.steps.forEach(s => {
            if(s.stepType === StepType.WASHING) {
                steps.push({
                    type: StepType.WASHING
                });
            }
            if(s.stepType === StepType.LIQUID_APPL) {
                const deplLiquid = depl.filter(d => d.liquidInfoId == s.liquidApplication.liquidInfoId)[0];
                const internalSlots = [...liquidConfigToMap().values()].reduce(SumFold(), 0);
                const liquid = deplLiquid.slotNumber > internalSlots ? {
                    External: deplLiquid.slotNumber - internalSlots
                } : {
                    slot: deplLiquid.slotNumber,
                    Internal: {
                        x: -1,
                        y: -1
                    } 
                };
                steps.push({
                    type: "Reagent",
                    params: {
                        //auto_wash: s.liquidApplication.autoWash,
                        liquid: liquid,
                        incubation: s.liquidApplication.liquidIncubationTime,
                        temperature: s.liquidApplication.incubationTemperature
                    }
                });
                //Add wash step if auto_wash
            }
            if(s.stepType === StepType.TEMP_CHANGE) {
                steps.push({
                    type: StepType.TEMP_CHANGE,
                    params: {
                        target: s.temperatureChange.targetTemperature
                    }
                })
            }
        })
        return steps;
    }

}
