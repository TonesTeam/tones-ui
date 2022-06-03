import { Liquid } from "@entity/Liquid";
import { LiquidApplication } from "@entity/LiquidApplication";
import { Protocol } from "@entity/Protocol";
import { Step, StepType } from "@entity/Step";
import { BlockParser } from "./AbstractBlockParser";

export class ApplyReagentParser extends BlockParser {

    async parse(applyReagent: Element, protocol: Protocol): Promise<Protocol> {
        this.helper.appendTempStep(protocol, parseInt(applyReagent.querySelector(":scope> field[name=degrees]")!.innerHTML), true);
        const times = parseInt(applyReagent.querySelector(":scope> field[name=times]")!.innerHTML)
        for (var i = 0; i < times; i++) {
            protocol.steps.push(await this.createLiquidApplicationStep(protocol, applyReagent));
        }
        this.helper.appendWaitStep(protocol, parseInt(applyReagent.querySelector(":scope> field[name=reagent]")!.innerHTML))
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
            type: "Reagent",
            liquidSubType: applyReagent.querySelector(":scope> field[name=reagent_type]")!.innerHTML,
            liquidName: applyReagent.querySelector(":scope> field[name=reagent]")!.innerHTML
        });
        return s;
    }
}