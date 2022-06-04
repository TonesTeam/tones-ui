import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { BlockParser } from "./AbstractBlockParser";
import { ApplyAntigenParser } from "./ApplyAntigenParser";
import { ApplyReagentParser } from "./ApplyReagentParser";

// "apply_reagent" 
// "apply_antigen_liquid" 
// "apply_blocking_liquid" 
// "apply_parafinization_liquid" 
// "apply_washing_liquid" 
// "wait" 
// "repeat" 
// "set_temperature" 


@provide(ParserMap)
export class ParserMap {

    private parserMap: Map<string, BlockParser>;

    public constructor(
        @inject(ApplyReagentParser) applyReagentParser: ApplyReagentParser,
        @inject(ApplyAntigenParser) applyAntigenParser: ApplyAntigenParser,
    ) {
        this.parserMap = new Map<string, BlockParser>([
            ["apply_reagent", applyReagentParser],
            ["apply_antigen_liquid", applyAntigenParser],
        ]);
    }


    public get(blockType: string): BlockParser | undefined {
        return this.parserMap.get(blockType);
    }
}
