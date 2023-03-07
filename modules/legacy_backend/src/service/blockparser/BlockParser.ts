import { Protocol } from "@entity/Protocol";
import { Maybe } from "@util/Maybe";
import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { ProcessorMap } from "./ProcessorMap";

@provide(BlockSequenceParser)
export class BlockSequenceParser {

    @inject(ProcessorMap)
    private processorMap: ProcessorMap;

    public async parse(block: Element, protocol: Protocol): Promise<Protocol> {
        const processedProtocol = this.processorMap.get(block.getAttribute("type")!)
            .getOrThrow(() => new Error(`Cannot deduce processor for block type ${block.getAttribute("type")}`))
            .process(block, protocol);
        const blockToProcess = block.querySelector(":scope > next > block");
        if (!blockToProcess) {
            return processedProtocol;
        }
        return await this.parse(blockToProcess, await processedProtocol)
    }
}