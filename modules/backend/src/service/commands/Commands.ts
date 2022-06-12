import { Liquid } from "@entity/Liquid";

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
    abstract serialize(): string
}

export class LiquidApplicationCommand extends Command {
    constructor(
        public from: number | undefined, //tube from which to extract liquid. Temporarily undefined while generaing reccomendations
        public to: number, //slot into which to pump liquid
        public volume: number, //volume of liquid to use (microliters)
        public liquidInfo: { id: number, isWashing: boolean }
    ) { super(CommandType.LiquidApplication); }


    serialize(): string {
        return `LA_${this.from}_${this.to}_${this.volume}`
    }
}

export class WaitingCommand extends Command {
    constructor(
        public time: number, //number of milliseconds to wait
    ) { super(CommandType.Waiting) }

    serialize(): string {
        return `W_${this.time}`
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