import { LiquidApplication } from "@entity/LiquidApplication";
import { Protocol } from "@entity/Protocol";
import { Step, StepType } from "@entity/Step";
import { provide } from "inversify-binding-decorators";
import { LiquidTypeName } from "sharedlib/enum/LiquidTypes";
import BlockProcessor from "./BlockProcessor";

@provide(ApplyReagentProcessor)
export default class ApplyReagentProcessor extends BlockProcessor {

    async process(applyReagent: Element, protocol: Protocol): Promise<Protocol> {
        this.helper.appendTempStep(protocol, parseInt(applyReagent.querySelector(":scope> field[name=degrees]")!.innerHTML), true);
        const times = parseInt(applyReagent.querySelector(":scope> field[name=times]")!.innerHTML)
        for (var i = 0; i < times; i++) {
            protocol.steps.push(await this.createLiquidApplicationStep(protocol, applyReagent));
        }
        this.helper.appendWaitStep(protocol, parseInt(applyReagent.querySelector(":scope> field[name=time]")!.innerHTML))
        return protocol;
    }


    private async createLiquidApplicationStep(protocol: Protocol, applyReagent: Element) {
        const s = new Step();
        s.sequenceOrder = this.helper.getLastStepIndex(protocol) + 1;
        s.protocol = protocol;
        s.stepType = StepType.LIQUID_APPLICATION;
        s.liquidApplication = new LiquidApplication();
        s.liquidApplication.step = s;
        s.liquidApplication.liquid = await this.helper.findLiquid({
            liquidType: {
                typeName: LiquidTypeName.REAGENT,
            },
            liquidSubType: {
                subTypeName: applyReagent.querySelector(":scope> field[name=reagent_type]")!.innerHTML,
            },
            liquidName: applyReagent.querySelector(":scope> field[name=reagent]")!.innerHTML,
        });
        return s;
    }
}