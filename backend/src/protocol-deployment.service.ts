import { Injectable } from '@nestjs/common';
import { countMap, MaxFold, SumFold, toKVMap } from 'sharedlib/collection.util';
import { LiquidDeploymentDTO } from 'sharedlib/dto/liquid-deployment.dto';
import { StepType } from 'sharedlib/enum/DBEnums';
import tonesConfig from 'sharedlib/new-tones-config.json';
import { DatabaseService } from './db.service';

@Injectable()
export class ProtocolDeploymentService {
    constructor(private readonly dbService: DatabaseService) {}

    async deployProtocol(protocolId: number): Promise<LiquidDeploymentDTO[]> {
        const p = await this.dbService.getProtocolById(protocolId);
        const appliedLiquids: number[] = p.steps
            .filter((s) => s.stepType === StepType.LIQUID_APPL)
            .map((s) => s.liquidApplication.liquidInfo.id);
        const liquidToUseCount = countMap(appliedLiquids);
        const config: LiquidDeploymentDTO[] = [];
        const liquidHolders = liquidConfigToMap();
        const liquidNames: Map<number, string> = new Map();
        for (const id of liquidToUseCount.keys()) {
            liquidNames.set(id, (await this.dbService.getLiquidInfo(id)).name);
        }

        liquidToUseCount.forEach((v, k) => {
            const amount = v * tonesConfig['liquid-application-volume'];
            getUsedHolders(amount, liquidHolders).forEach((sl) =>
                config.push({
                    liquidInfoId: k,
                    amount: sl.size,
                    slotNumber: sl.slot,
                    liquidName: liquidNames.get(k),
                }),
            );
        });
        return config;
    }
}

export function liquidConfigToMap(): Map<number, number> {
    return toKVMap(
        tonesConfig['liquids-tube-holders'].filter((lh) => !lh.external),
        (i) => i.size,
        (i) => i.count,
    );
}

export function getUsedHolders(
    liquidAmount: number,
    liquidHolders: Map<number, number>,
): { slot: number; size: number }[] {
    let remainder = liquidAmount;
    const solution: { slot: number; size: number }[] = [];
    const min = Math.min(...Array.from(liquidHolders.keys()));
    while (remainder > 0) {
        if (Array.from(liquidHolders.values()).some((i) => i < 0)) {
            throw new Error('Cannot distribute liquids');
        }
        const bestHolder = Array.from(liquidHolders.entries())
            .filter(([k, _]) => k <= remainder)
            .map(([k, _]) => k)
            .reduce(MaxFold(), min);
        remainder = remainder - bestHolder;
        const slot =
            liquidConfigToMap().get(bestHolder) -
            liquidHolders.get(bestHolder) +
            prevSlots(bestHolder);
        solution.push({ slot, size: bestHolder });
        liquidHolders.set(bestHolder, liquidHolders.get(bestHolder) - 1);
    }
    return solution;
}

function prevSlots(liquidHolderSize: number): number {
    return Array.from(liquidConfigToMap().entries())
        .filter(([k, _]) => k < liquidHolderSize)
        .map(([_, v]) => v)
        .reduce(SumFold(), 0);
}
