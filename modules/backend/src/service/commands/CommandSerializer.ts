import { DeploymentLiquidConfiguration } from "sharedlib/dto/liquidconfiguration.dto";
import { Command, CommandType, LiquidApplicationCommand, TemperatureChangeCommand, WaitingCommand } from "./Commands";
import config from "sharedlib/tones-config.json";
import { provide } from "inversify-binding-decorators";

@provide(CommandSerializer)
export class CommandSerializer {

    public serialize(c: Command, deploymentConfig: DeploymentLiquidConfiguration[]): string {
        if (c.commandType === CommandType.TemperatureChange) {
            return (c as TemperatureChangeCommand).serialize();
        }
        if (c.commandType === CommandType.Waiting) {
            return (c as WaitingCommand).serialize();
        }
        if (c.commandType === CommandType.LiquidApplication) {
            return this.serializeLiqiuidApplication(c as LiquidApplicationCommand, deploymentConfig);
        }
        throw new Error(`Cannot serialize ${c}`)
    }

    private serializeLiqiuidApplication(c: LiquidApplicationCommand, deploymentConfig: DeploymentLiquidConfiguration[]): string {
        const tubeSize = deploymentConfig.filter(dc => dc.liquidSlotNumber == c.from).at(0)!.liquidAmount;
        const coord = new Map(Object.entries(config["tube-holder-coordinates"])).get(c.from!.toString())!;
        const depth = config["liquids-tube-holders"].filter(th => th.size === tubeSize).at(0)!.depth;
        return `LA_${coord}:${depth}_${c.to}_${c.volume * 1000}`
    }
}

