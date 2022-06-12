import { LiquidType } from "@entity/Liquid";
import { Step, StepType } from "@entity/Step";
import { provide } from "inversify-binding-decorators";
import { LiquidTypeName } from "sharedlib/enum/LiquidTypes";
import config from "sharedlib/tones-config.json";
import { Command, LiquidApplicationCommand, TemperatureChangeCommand, WaitingCommand } from "./Commands";

@provide(ProtocolCommandsMapper)
export class ProtocolCommandsMapper {


    public stepToCommand(step: Step, slots: number[]): Command[] {
        const stepMap: Map<StepType, (s: Step) => Command[]> = new Map([
            [StepType.TEMPERATURE_CHANGE, this.tempChangeStep],
            [StepType.WAITING, this.waitingStep],
            [StepType.LIQUID_APPLICATION, (s) => this.liquidApplicationStep(s, slots)],
        ]);
        return stepMap.get(step.stepType)!(step)
    }

    private liquidApplicationStep(lq: Step, slots: number[]): Command[] {
        const vol = config["liquid-application-volume"] * 1000; // milligram to microgram conversion
        const liquid = lq.liquidApplication!.liquid;
        const liquidInfo = { id: liquid.id, isWashing: liquid.liquidType.typeName === LiquidTypeName.WASHING };
        return slots.map(s => new LiquidApplicationCommand(undefined, s, vol, liquidInfo))
    }

    private waitingStep(w: Step): Command[] {
        return [new WaitingCommand(w.waiting!.waitingTime * 1000)]; // second to millisecond conversion
    }

    private tempChangeStep(tc: Step): Command[] {
        const tempChange = tc.temperatureChange!;
        return [new TemperatureChangeCommand(tempChange.blocking, tempChange.targetTemperature)];
    }
}