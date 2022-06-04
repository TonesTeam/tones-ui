import { Protocol } from "@entity/Protocol";
import { DatabaseService } from "@service/DatabaseService";
import { lazyInject } from "@util/LazyInject";
import { Maybe } from "@util/Maybe";
import { inject, injectable, LazyServiceIdentifer } from "inversify";
import { BlockParserHelper } from "./BlockParserHelper";
import { ParserMap } from "./ParserMap";


@injectable()
export abstract class BlockParser {

    @inject(BlockParserHelper)
    protected helper: BlockParserHelper;
    @lazyInject(() => ParserMap)
    private parserMap: ParserMap;

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

    protected abstract parse(block: Element, protocol: Protocol): Promise<Protocol>;

    private async parseContinue(blockContainer: Element, protocol: Protocol): Promise<Protocol> {
        const blockToParse = blockContainer.querySelector(":scope > block")!
        const parser = this.parserMap.get(blockToParse.getAttribute("type")!)
        if (parser === undefined) {
            throw new Error(`Unable to parse ${blockToParse.getAttribute("type")}, ${blockToParse.outerHTML}`)
        }
        return await this.parserMap.get(blockToParse.getAttribute("type")!)!.parseProtocol(blockToParse, await protocol)
    }


}