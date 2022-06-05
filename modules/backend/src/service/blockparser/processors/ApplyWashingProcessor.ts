import { Liquid } from "@entity/Liquid";
import { Protocol } from "@entity/Protocol";
import { provide } from "inversify-binding-decorators";
import { LiquidTypeName } from "sharedlib/enum/LiquidTypes";
import BlockProcessor from "./BlockProcessor";

@provide(ApplyWashingProcessor)
export default class ApplyWashingProcessor extends BlockProcessor {

    public async process(applyWashingBlock: Element, protocol: Protocol): Promise<Protocol> {
        this.helper.appendLiquidApplicationStep(protocol, await this.getWashingLiquid(applyWashingBlock));
        this.helper.appendWaitStep(protocol, parseInt(applyWashingBlock.querySelector(":scope>field[name=time]")!.innerHTML));
        return protocol;
    }

    private getWashingLiquid(applyAntigenBlock: Element): Promise<Liquid> {
        return this.helper.findLiquid({
            liquidName: applyAntigenBlock.querySelector(":scope>field[name=liquid]")!.innerHTML,
            liquidType: {
                typeName: LiquidTypeName.WASHING
            },
        });
    }

}