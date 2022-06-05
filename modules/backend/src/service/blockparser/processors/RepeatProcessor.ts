import { Protocol } from "@entity/Protocol";
import { lazyInject } from "@util/LazyInject";
import { provide } from "inversify-binding-decorators";
import { BlockSequenceParser } from "../BlockParser";
import BlockProcessor from "./BlockProcessor";

@provide(RepeatProcessor)
export class RepeatProcessor extends BlockProcessor {

    @lazyInject(() => BlockSequenceParser)
    blockParser: BlockSequenceParser;

    public async process(repeatBlock: Element, protocol: Protocol): Promise<Protocol> {
        const times = parseInt(repeatBlock.querySelector(":scope>field[name=times]")!.innerHTML)
        const blockToProcess = repeatBlock.querySelector(":scope>statement>block")
        if (!blockToProcess) {
            return protocol;
        }
        for (let i = 0; i < times; i++) {
            protocol = await this.blockParser.parse(blockToProcess, protocol)
        }
        return protocol;
    }

}