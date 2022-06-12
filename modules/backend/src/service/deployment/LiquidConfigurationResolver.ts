import { DeploymentLiquidConfiguration } from "../../entity/future/DeploymentLiquidConfiguration";
import { LiquidApplicationCommand } from "../../service/commands/Commands";
import { provide } from "inversify-binding-decorators";
import { getComparator, groupBy } from "sharedlib/collection.util";
import config from "sharedlib/tones-config.json";
import * as lodash from "lodash"

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
        return previousLiquidSlots + sizeCount - this.tubeSizeCountMap.get(size)!;
    }
}

@provide(LiquidConfigurationResolver)
export class LiquidConfigurationResolver {

    public getDeploymentConfiguration(commands: LiquidApplicationCommand[]): DeploymentLiquidConfiguration[] {
        const state = new TubeConfigState();
        const nonWashingCommands = commands.filter(la => !la.liquidInfo.isWashing);
        const nonWashingDeploymentConfig = this.getLiquidsConfiguration(nonWashingCommands, state)
        const washingTubeConfig = config["liquids-tube-holders"].filter(t => t["for-washing"])[0]
        state.tubeSizeCountMap.set(washingTubeConfig.size, washingTubeConfig.count);
        const washingDeploymentConfig = this.getLiquidsConfiguration(commands.filter(la => la.liquidInfo.isWashing), state)
        return lodash.concat(nonWashingDeploymentConfig, washingDeploymentConfig)
    }

    private getLiquidsConfiguration(commands: LiquidApplicationCommand[], state: TubeConfigState): DeploymentLiquidConfiguration[] {
        return Array.from(groupBy(commands, c => c.liquidInfo.id).values())
            .sort(getComparator(cms => lodash.sum(cms.map(c => c.volume))))
            .flatMap(cms => this.getLiquidConfiguration_2(cms, state))
    }

    private getLiquidConfiguration(commands: LiquidApplicationCommand[], state: TubeConfigState): DeploymentLiquidConfiguration[] {
        const liquidConfig: DeploymentLiquidConfiguration[] = [];
        let availableSizes = state.getAvailableSizes()
        let hydratedCommands: LiquidApplicationCommand[] = [];
        for (let i = 0; i < commands.length; i++) {
            if (availableSizes.length === 0) {
                throw new Error("Impossible to configure liquids for protocol deployment");
            }
            const command = commands[i];
            availableSizes = availableSizes.map(i => i - command.volume);
            hydratedCommands.push(command);
            if (availableSizes.every(s => s < 0)) {
                const dlc = new DeploymentLiquidConfiguration();
                dlc.liquidAmount = Math.max(...state.getAvailableSizes());
                dlc.liquidId = commands[0].liquidInfo.id!;
                dlc.liquidSlotNumber = state.allocateLiquidSlotOfSize(dlc.liquidAmount);
                liquidConfig.push(dlc);
                availableSizes = state.getAvailableSizes();
                hydratedCommands.forEach(c => c.from = dlc.liquidSlotNumber);
                hydratedCommands = [];
                i--;
                continue;
            }
        }
        if (availableSizes.length === 0) {
            throw new Error("Impossible to configure liquids for protocol deployment");
        }
        const sizeIndex = availableSizes.findIndex(i => i >= 0)
        const dlc = new DeploymentLiquidConfiguration();
        dlc.liquidAmount = state.getAvailableSizes()[sizeIndex];
        dlc.liquidId = commands[0].liquidInfo.id!;
        dlc.liquidSlotNumber = state.allocateLiquidSlotOfSize(dlc.liquidAmount);
        hydratedCommands.forEach(c => c.from = dlc.liquidSlotNumber);
        liquidConfig.push(dlc);
        return liquidConfig;
    }

    private getLiquidConfiguration_2(commands: LiquidApplicationCommand[], state: TubeConfigState): DeploymentLiquidConfiguration[] {
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
                const dlc = new DeploymentLiquidConfiguration();
                dlc.liquidAmount = Math.max(...state.getAvailableSizes());
                dlc.liquidId = commands[0].liquidInfo.id!;
                dlc.liquidSlotNumber = state.allocateLiquidSlotOfSize(dlc.liquidAmount);
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
        const dlc = new DeploymentLiquidConfiguration();
        dlc.liquidAmount = state.getAvailableSizes()[sizeIndex];
        dlc.liquidId = commands[0].liquidInfo.id!;
        dlc.liquidSlotNumber = state.allocateLiquidSlotOfSize(dlc.liquidAmount);
        hydratedCommands.forEach(c => c.from = dlc.liquidSlotNumber);
        liquidConfig.push(dlc);
        return liquidConfig;
    }

}