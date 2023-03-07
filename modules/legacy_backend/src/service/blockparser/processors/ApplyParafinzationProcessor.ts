import { Liquid } from "@entity/Liquid";
import { Protocol } from "@entity/Protocol";
import { provide } from "inversify-binding-decorators";
import { LiquidTypeName } from "sharedlib/enum/LiquidTypes";
import BlockProcessor from "./BlockProcessor";

@provide(ApplyDeparafinizationProcessor)
export default class ApplyDeparafinizationProcessor extends BlockProcessor {

    public async process(applyDeparafinizationBlock: Element, protocol: Protocol): Promise<Protocol> {
        this.helper.appendLiquidApplicationStep(protocol, await this.getDeparafinizationLiquid());
        this.helper.appendWaitStep(protocol, parseInt(applyDeparafinizationBlock.querySelector(":scope>field[name=time]")!.innerHTML));
        return protocol;
    }

    private getDeparafinizationLiquid(): Promise<Liquid> {
        return this.helper.findLiquid({
            liquidType: {
                typeName: LiquidTypeName.DEPARAFINAZATION
            },
        });
    }

}