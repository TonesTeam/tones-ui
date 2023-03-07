import { Liquid } from "@entity/Liquid";
import { LiquidApplication } from "@entity/LiquidApplication";
import { Protocol } from "@entity/Protocol";
import { Step, StepType } from "@entity/Step";
import { provide } from "inversify-binding-decorators";
import { LiquidTypeName } from "sharedlib/enum/LiquidTypes";
import BlockProcessor from "./BlockProcessor";

@provide(ApplyAntigenProcessor)
export default class ApplyAntigenProcessor extends BlockProcessor {

    async process(applyAntigenBlock: Element, protocol: Protocol): Promise<Protocol> {
        this.helper.appendLiquidApplicationStep(protocol, await this.getAntigenLiquid(applyAntigenBlock));
        this.helper.appendWaitStep(protocol, parseInt(applyAntigenBlock.querySelector(":scope>field[name=time]")!.innerHTML));
        return protocol;
    }


    private getAntigenLiquid(applyAntigenBlock: Element): Promise<Liquid> {
        return this.helper.findLiquid({
            liquidName: applyAntigenBlock.querySelector(":scope>field[name=liquid]")!.innerHTML,
            liquidType: {
                typeName: LiquidTypeName.ANTIGEN
            },
        });
    }
}