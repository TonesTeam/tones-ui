import { Protocol } from "@entity/Protocol";
import { DatabaseService } from "@service/DatabaseService";
import { Maybe } from "@util/Maybe";
import { inject } from "inversify";
import { BlockParserHelper } from "./BlockParserHelper";
import { ParserMap } from "./ParserMap";

export abstract class BlockParser {

    @inject(BlockParserHelper)
    helper: BlockParserHelper;
    @inject(DatabaseService)
    databaseService: DatabaseService;

    public async parseProtocol(block: Element, protocol: Protocol): Promise<Protocol> {
        let modifiedProtocol = this.parse(block, protocol);
        modifiedProtocol = Maybe.fromValue(block.querySelector(":scope > statement"))
            .map(async statement => this.parseContinue(statement, await modifiedProtocol))
            .getOrElse(modifiedProtocol);
        modifiedProtocol = Maybe.fromValue(block.querySelector(":scope > next"))
            .map(async statement => this.parseContinue(statement, await modifiedProtocol))
            .getOrElse(modifiedProtocol);
        return modifiedProtocol;
    }

    private async parseContinue(blockContainer: Element, protocol: Protocol): Promise<Protocol> {
        const blockToParse = blockContainer.querySelector(":scope > block")!
        const parser = ParserMap.get(blockToParse.getAttribute("type")!)
        if (parser === undefined) {
            throw new Error(`Unable to parse ${blockToParse.getAttribute("type")}, ${blockToParse.outerHTML}`)
        }
        return await ParserMap.get(blockToParse.getAttribute("type")!)!.parseProtocol(blockToParse, await protocol)
    }

    abstract parse(block: Element, protocol: Protocol): Promise<Protocol>;

}