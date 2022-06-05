import { Maybe } from "@util/Maybe";
import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import ApplyAntigenProcessor from "./processors/ApplyAntigenProcessor";
import ApplyBlockingProcessor from "./processors/ApplyBlockingProcessor";
import ApplyDeparafinizationProcessor from "./processors/ApplyParafinzationProcessor";
import ApplyReagentProcessor from "./processors/ApplyReagentProcessor";
import ApplyWashingProcessor from "./processors/ApplyWashingProcessor";
import BlockProcessor from "./processors/BlockProcessor";
import { RepeatProcessor } from "./processors/RepeatProcessor";
import SetTemperatureProcessor from "./processors/SetTemperatureProcessor";
import WaitProcessor from "./processors/WaitProcessor";

@provide(ProcessorMap)
export class ProcessorMap {

    private parserMap: Map<string, BlockProcessor>;

    public constructor(
        @inject(WaitProcessor) waitProcessor: WaitProcessor,
        @inject(RepeatProcessor) repeatProcessor: RepeatProcessor,
        @inject(ApplyReagentProcessor) applyReagentParser: ApplyReagentProcessor,
        @inject(ApplyAntigenProcessor) applyAntigenParser: ApplyAntigenProcessor,
        @inject(ApplyWashingProcessor) applyWashingProcessor: ApplyWashingProcessor,
        @inject(ApplyBlockingProcessor) applyBlockingProcessor: ApplyBlockingProcessor,
        @inject(SetTemperatureProcessor) setTemperatureProcessor: SetTemperatureProcessor,
        @inject(ApplyDeparafinizationProcessor) applyDeparafinizationProcessor: ApplyDeparafinizationProcessor,
    ) {
        this.parserMap = new Map<string, BlockProcessor>([
            ["wait", waitProcessor],
            ["repeat", repeatProcessor],
            ["apply_reagent", applyReagentParser],
            ["set_temperature", setTemperatureProcessor],
            ["apply_antigen_liquid", applyAntigenParser],
            ["apply_washing_liquid", applyWashingProcessor],
            ["apply_blocking_liquid", applyBlockingProcessor],
            ["apply_parafinization_liquid", applyDeparafinizationProcessor],
        ]);
    }


    public get(blockType: string): Maybe<BlockProcessor> {
        return Maybe.fromValue(this.parserMap.get(blockType));
    }
}
