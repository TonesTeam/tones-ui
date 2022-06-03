import { Protocol } from "@entity/Protocol";
import { Maybe } from "@util/Maybe";
import { ParserMap } from "./ParserMap";

export abstract class BlockParser {

    public parseProtocol(block: Element, protocol: Protocol): Protocol {
        let modifiedProtocol = this.parse(block, protocol);
        modifiedProtocol = Maybe.fromValue(block.querySelector(":scope > statement"))
            .map(statement => this.parseContinue(statement, modifiedProtocol))
            .getOrElse(modifiedProtocol);
        modifiedProtocol = Maybe.fromValue(block.querySelector(":scope > next"))
            .map(statement => this.parseContinue(statement, modifiedProtocol))
            .getOrElse(modifiedProtocol);
        return modifiedProtocol;
    }

    private parseContinue(blockContainer: Element, protocol: Protocol): Protocol {
        const blockToParse = blockContainer.querySelector(":scope > block")!
        const parser = ParserMap.get(blockToParse.getAttribute("type")!)
        if (parser === undefined) {
            throw new Error(`Unable to parse ${blockToParse.getAttribute("type")}, ${blockToParse.outerHTML}`)
        }
        return ParserMap.get(blockToParse.getAttribute("type")!)!.parseProtocol(blockToParse, protocol)
    }

    abstract parse(block: Element, protocol: Protocol): Protocol;

}