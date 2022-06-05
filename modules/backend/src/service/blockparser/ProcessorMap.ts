import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { BlockProcessor } from "./processors/BlockProcessor";
import { ApplyAntigenProcessor } from "./processors/ApplyAntigenProcessor";
import { Maybe } from "@util/Maybe";
import { ApplyReagentProcessor } from "./processors/ApplyReagentProcessor";
import { RepeatProcessor } from "./processors/RepeatProcessor";

// "apply_reagent" 
// "apply_antigen_liquid" 
// "apply_blocking_liquid" 
// "apply_parafinization_liquid" 
// "apply_washing_liquid" 
// "wait" 
// "repeat" 
// "set_temperature" 


@provide(ProcessorMap)
export class ProcessorMap {

    private parserMap: Map<string, BlockProcessor>;

    public constructor(
        @inject(RepeatProcessor) repeatProcessor: RepeatProcessor,
        @inject(ApplyReagentProcessor) applyReagentParser: ApplyReagentProcessor,
        @inject(ApplyAntigenProcessor) applyAntigenParser: ApplyAntigenProcessor,
    ) {
        this.parserMap = new Map<string, BlockProcessor>([
            ["repeat", repeatProcessor],
            ["apply_reagent", applyReagentParser],
            ["apply_antigen_liquid", applyAntigenParser],
        ]);
    }


    public get(blockType: string): Maybe<BlockProcessor> {
        return Maybe.fromValue(this.parserMap.get(blockType));
    }
}
