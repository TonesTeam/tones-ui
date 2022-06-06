import { Protocol } from "@entity/Protocol";
import { StepType } from "@entity/Step";
import { ProtocolDto, UsedProtocolLiquid } from "sharedlib/dto/protocol.dto"
import { groupBy, groupByMapped } from "sharedlib/collection.util"
import { ident } from "sharedlib/functional.util"
import { LiquidApplication } from "@entity/LiquidApplication";
import { Liquid, LiquidType } from "@entity/Liquid";
import config from "sharedlib/tones-config.json";
import { provide } from "inversify-binding-decorators";

@provide(ProtocolMapper)
export default class ProtocolMapper {

    public toDto(p: Protocol): ProtocolDto {
        return {
            id: p.id,
            name: p.protocolName,
            authorName: p.creator.name,
            creationDate: p.creationDate,
            usedLiquids: this.usedLiquids(p)
        }
    }

    private usedLiquids(p: Protocol) {
        const liquidSteps = p.steps
            .filter(s => StepType.LIQUID_APPLICATION === s.stepType)
            .map(s => s.liquidApplication!);
        const liquidsNameMap = groupBy(liquidSteps.map(l => l.liquid), l => l.liquidName)
        const liquidsMap = groupBy(liquidSteps, s => s.liquid.liquidName);
        return Array.from(liquidsMap.entries())
            .map(e => this.mapUsedLiquid(e, liquidsNameMap))

    }

    private mapUsedLiquid(ent: [string, LiquidApplication[]], liquidsNameMap: Map<string, Liquid[]>): UsedProtocolLiquid {
        return {
            liquidName: ent[0],
            liquidType: liquidsNameMap.get(ent[0])!.at(0)!.liquidType.typeName,
            amount: ent[1].length * config["liquid-application-volume"]
        }
    }
}
