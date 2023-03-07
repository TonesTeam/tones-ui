import { CommandSerializer } from "@service/commands/CommandSerializer";
import { provide } from "inversify-binding-decorators";
import * as lodash from "lodash";
import { getComparator, groupBy } from "sharedlib/collection.util";
import { DeploymentLiquidConfiguration } from "sharedlib/dto/liquidconfiguration.dto";
import config from "sharedlib/tones-config.json";
import { LiquidApplicationCommand } from "../../service/commands/Commands";

class TubeConfigState {
    tubeSizeCountMap: Map<number, number> = new Map(
        config["liquids-tube-holders"]
            .filter(th => !th["for-washing"])
            .map(th => [th["size"], th["count"]])
    )

    getAvailableSizes() {
        return Array.from(this.tubeSizeCountMap.entries()).filter(kv => kv[1] > 0).map(kv => kv[0])
    }

    allocateLiquidSlotOfSize(size: number) {
        const sizeCount = config["liquids-tube-holders"]
            .filter(th => th["size"] === size)
            .map(th => th["count"])[0]
        const previousLiquidSlots = config["liquids-tube-holders"]
            .filter(th => th["size"] < size)
            .map(th => th["count"])
            .reduce((a, b) => a + b, 0)
        this.tubeSizeCountMap.set(size, this.tubeSizeCountMap.get(size)! - 1)
        let allocatedSlot = previousLiquidSlots + sizeCount - this.tubeSizeCountMap.get(size)!
        if (size == 500) {
            return allocatedSlot + 1; // +1 because slot 34 is for water so must be skipped
        }
        return allocatedSlot;
    }
}

@provide(LiquidConfigurationResolver)
export class LiquidConfigurationResolver {

    public resolveLiquidConfiguration(commands: LiquidApplicationCommand[]): DeploymentLiquidConfiguration[] {
        const state = new TubeConfigState();
        const nonWashingCommands = commands.filter(la => !la.liquidInfo.isWashing);
        const nonWashingDeploymentConfig = this.getLiquidsConfiguration(nonWashingCommands, state)
        const washingTubeConfig = config["liquids-tube-holders"].filter(t => t["for-washing"])[0]
        state.tubeSizeCountMap.set(washingTubeConfig.size, washingTubeConfig.count);
        const washingDeploymentConfig = this.getWashingConfiguration(commands, state);
        return lodash.concat(nonWashingDeploymentConfig, washingDeploymentConfig)
    }

    private getWashingConfiguration(commands: LiquidApplicationCommand[], state: TubeConfigState): DeploymentLiquidConfiguration[] {
        let washCommands = commands.filter(la => la.liquidInfo.isWashing);
        return Array.from(groupBy(washCommands, lac => lac.liquidInfo.id).values())
            .map(locs => this.washingCommandsToDeploymentConfig(locs, state));
    }

    private washingCommandsToDeploymentConfig(sameLiquidWashingCommands: LiquidApplicationCommand[], state: TubeConfigState): DeploymentLiquidConfiguration {
        let liquid = sameLiquidWashingCommands[0].liquidInfo;
        let slot = liquid.isWater ? 34 : state.allocateLiquidSlotOfSize(500)
        sameLiquidWashingCommands.forEach(c => c.from = slot)
        return {
            liquid: undefined,
            liquidAmount: lodash.sum(sameLiquidWashingCommands.map(i => i.volume)),
            liquidId: liquid.id!,
            liquidSlotNumber: slot
        };
    }

    private getLiquidsConfiguration(commands: LiquidApplicationCommand[], state: TubeConfigState): DeploymentLiquidConfiguration[] {
        return Array.from(groupBy(commands, c => c.liquidInfo.id).values())
            .sort(getComparator(cms => lodash.sum(cms.map(c => c.volume))))
            .flatMap(cms => this.getLiquidConfiguration(cms, state))
    }

    private getLiquidConfiguration(commands: LiquidApplicationCommand[], state: TubeConfigState): DeploymentLiquidConfiguration[] {
        let acc = 0;
        let hydratedCommands: LiquidApplicationCommand[] = [];
        const liquidConfig: DeploymentLiquidConfiguration[] = []
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            if (command.volume > Math.max(...state.getAvailableSizes())) {
                throw new Error("Impossible to configure liquids for protocol deployment");
            }
            acc += command.volume;
            if (state.getAvailableSizes().every(s => acc > s)) {
                const maxAvailableSize = Math.max(...state.getAvailableSizes())
                const dlc: DeploymentLiquidConfiguration = {
                    liquidAmount: maxAvailableSize,
                    liquidId: commands[0].liquidInfo.id!,
                    liquidSlotNumber: state.allocateLiquidSlotOfSize(maxAvailableSize),
                    liquid: undefined
                }
                liquidConfig.push(dlc);
                hydratedCommands.forEach(c => c.from = dlc.liquidSlotNumber);
                hydratedCommands = [];
                acc = 0;
                i--;
                continue;
            }
            hydratedCommands.push(command);
        }
        const sizeIndex = state.getAvailableSizes().findIndex(s => s >= acc)
        if (sizeIndex === -1) {
            throw new Error("Impossible to configure liquids for protocol deployment");
        }
        const maxRequiredSize = state.getAvailableSizes()[sizeIndex]
        const dlc: DeploymentLiquidConfiguration = {
            liquidAmount: maxRequiredSize,
            liquidId: commands[0].liquidInfo.id!,
            liquidSlotNumber: state.allocateLiquidSlotOfSize(maxRequiredSize),
            liquid: undefined
        }
        hydratedCommands.forEach(c => c.from = dlc.liquidSlotNumber);
        liquidConfig.push(dlc);
        return liquidConfig;
    }

}