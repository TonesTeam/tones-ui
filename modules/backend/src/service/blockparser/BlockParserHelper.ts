import { Liquid } from "@entity/Liquid";
import { Protocol } from "@entity/Protocol";
import { Step, StepType } from "@entity/Step";
import { TemperatureChange } from "@entity/TemperatureChange";
import { Waiting } from "@entity/Waiting";
import { DatabaseService } from "@service/DatabaseService";
import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { FindCondition, FindConditions, FindOneOptions } from "typeorm";

@provide(BlockParserHelper)
export class BlockParserHelper {

    @inject(DatabaseService)
    databseService: DatabaseService;

    public getLastStepIndex(protocol: Protocol): number {
        const indices = protocol.steps.map(s => s.sequenceOrder)
        if (indices.length === 0) {
            return 0;
        }
        return Math.max(...indices)
    }

    public async findLiquid<T>(op: T) {
        const repo = await this.databseService.getRepository(Liquid)
        return await repo.findOneOrFail({ where: op })
    }

    public appendWaitStep(protocol: Protocol, time: number) {
        const s = new Step()
        s.sequenceOrder = this.getLastStepIndex(protocol) + 1;
        s.protocol = protocol;
        s.stepType = StepType.WAITING;
        s.waiting = new Waiting();
        s.waiting.waitingTime = time;
        s.waiting.step = s;
        protocol.steps.push(s);
    }

    public appendTempStep(protocol: Protocol, targetTemp: number, blocking: boolean) {
        const s = new Step();
        s.sequenceOrder = this.getLastStepIndex(protocol) + 1;
        s.protocol = protocol;
        s.stepType = StepType.TEMPERATURE_CHANGE;
        s.temperatureChange = new TemperatureChange();
        s.temperatureChange.blocking = blocking;
        s.temperatureChange.targetTemperature = targetTemp;
        s.temperatureChange.step = s;
        protocol.steps.push(s);
    }
}