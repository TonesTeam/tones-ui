import { Protocol } from "@entity/Protocol";
import { Maybe } from "@util/Maybe";
import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { ProcessorMap } from "./ProcessorMap";

@provide(BlockSequenceParser)
export class BlockSequenceParser {

    @inject(ProcessorMap)
    private processorMap: ProcessorMap;

    public parse(block: Element, protocol: Protocol): Promise<Protocol> {
        const processedProtocol = Maybe.fromValue(block.getAttribute("type"))
            .flatMap(t => this.processorMap.get(t))
            .map(pr => pr.process(block, protocol))
            .getOrThrow(() => new Error(`Cannot deduce processor for block type ${block.getAttribute("type")}`));
        Maybe.fromValue(block.querySelector(":scope > next > block"))
            .map(async bl => this.parse(bl, await processedProtocol));
        return processedProtocol;
    }
}