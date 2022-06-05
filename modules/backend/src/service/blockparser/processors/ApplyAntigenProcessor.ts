import { LiquidApplication } from "@entity/LiquidApplication";
import { Protocol } from "@entity/Protocol";
import { Step, StepType } from "@entity/Step";
import { BlockProcessor } from "./BlockProcessor";
import { LiquidTypeName } from "sharedlib/enum/LiquidTypes";
import { provide } from "inversify-binding-decorators";

@provide(ApplyAntigenProcessor)
export class ApplyAntigenProcessor extends BlockProcessor {

    async process(applyAntigenBlock: Element, protocol: Protocol): Promise<Protocol> {
        await this.addAntigenApplicationStep(protocol, applyAntigenBlock);
        this.helper.appendWaitStep(protocol, parseInt(applyAntigenBlock.querySelector(":scope>field[name=time]")!.innerHTML));
        return protocol;
    }


    private async addAntigenApplicationStep(protocol: Protocol, applyAntigenBlock: Element) {
        const s = new Step();
        s.protocol = protocol;
        s.sequenceOrder = this.helper.getLastStepIndex(protocol) + 1;
        s.stepType = StepType.LIQUID_APPLICATION;
        s.liquidApplication = new LiquidApplication();
        s.liquidApplication.step = s;
        s.liquidApplication.liquid = await this.helper.findLiquid({
            liquidName: applyAntigenBlock.querySelector(":scope>field[name=liquid]")!.innerHTML,
            liquidType: {
                typeName: LiquidTypeName.ANTIGEN
            },
        });
        protocol.steps.push(s);
    }
}