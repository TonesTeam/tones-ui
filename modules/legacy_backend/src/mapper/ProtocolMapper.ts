import { Liquid } from '@entity/Liquid';
import { LiquidApplication } from '@entity/LiquidApplication';
import { Protocol } from '@entity/Protocol';
import { StepType } from '@entity/Step';
import { provide } from 'inversify-binding-decorators';
import { groupBy, toMap } from 'sharedlib/collection.util';
import {
    ProtocolDto,
    UsedProtocolLiquid,
} from 'sharedlib/dto/legacy/protocol.dto';
import config from 'sharedlib/tones-config.json';

@provide(ProtocolMapper)
export default class ProtocolMapper {
    public toDto(p: Protocol): ProtocolDto {
        return {
            id: p.id,
            name: p.protocolName,
            authorName: p.creator.name,
            creationDate: p.creationDate,
            usedLiquids: this.usedLiquids(p),
        };
    }

    private usedLiquids(p: Protocol) {
        const liquidSteps = p.steps
            .filter((s) => StepType.LIQUID_APPLICATION === s.stepType)
            .map((s) => s.liquidApplication!);
        const liquidsNameMap = toMap(
            liquidSteps.map((l) => l.liquid),
            (l) => l.liquidName,
        );
        const liquidsMap = groupBy(liquidSteps, (s) => s.liquid.liquidName);
        return Array.from(liquidsMap.entries()).map((e) =>
            this.mapUsedLiquid(e, liquidsNameMap),
        );
    }

    private mapUsedLiquid(
        ent: [string, LiquidApplication[]],
        liquidsNameMap: Map<string, Liquid>,
    ): UsedProtocolLiquid {
        return {
            liquidName: ent[0],
            liquidType: liquidsNameMap.get(ent[0])!.liquidType.typeName,
            amount: ent[1].length * config['liquid-application-volume'],
        };
    }
}
