import { Protocol } from "@entity/Protocol";
import { inject, injectable } from "inversify";
import { BlockProcessingHelper } from "./BlockProcessingHelper";


@injectable()
export abstract class BlockProcessor {

    @inject(BlockProcessingHelper)
    protected helper: BlockProcessingHelper;

    public abstract process(block: Element, protocol: Protocol): Promise<Protocol>;

}