import { Protocol } from "@entity/Protocol";

export abstract class BlockParser {

    // public parseProtocol(block: Element, protocol: Protocol): Protocol {
    // }

    abstract parse(block: Element, protocol: Protocol): Protocol;

}