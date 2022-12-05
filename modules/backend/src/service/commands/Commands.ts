
export enum CommandType {
    LiquidApplication,
    Waiting,
    TemperatureChange
}

export abstract class Command {
    order: number;
    constructor(
        public commandType: CommandType
    ) { }
}

export class LiquidApplicationCommand extends Command {
    constructor(
        public from: number | undefined, //tube from which to extract liquid. Temporarily undefined while generaing reccomendations
        public to: number, //slot into which to pump liquid
        public volume: number, //volume of liquid to use (milliliters)
        public liquidInfo: { id: number, isWashing: boolean, isWater: boolean }
    ) { super(CommandType.LiquidApplication); }

}

export class WaitingCommand extends Command {
    constructor(
        public time: number, //number of seconds to wait
    ) { super(CommandType.Waiting) }

    serialize(): string {
        return `W_${this.time * 1000}`
    }
}

export class TemperatureChangeCommand extends Command {
    constructor(
        public blocking: boolean, // wait or not wait for temperature change
        public targetTemperature: number, // temperature to which to change 
    ) { super(CommandType.TemperatureChange) }

    serialize(): string {
        if (this.blocking) {
            return `BTC_${this.targetTemperature}`
        }
        return `TC_${this.targetTemperature}`
    }
}