import { Protocol, ProtocolType } from "@entity/Protocol";
import { ProtocolXml } from "@entity/ProtocolXml";
import { User } from "@entity/User";
import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { JSDOM } from "jsdom";
import { BlockSequenceParser } from "./blockparser/BlockParser";
import { DatabaseService } from "./DatabaseService";
import { DateService } from "./DateService";

@provide(ProtocolXmlParsingService)
export class ProtocolXmlParsingService {

    @inject(DateService)
    private dateService: DateService;
    @inject(DatabaseService)
    private dbservice: DatabaseService;
    @inject(BlockSequenceParser)
    blockParser: BlockSequenceParser;

    public async parseProtocolXml(protocolXml: Element): Promise<Protocol> {
        const protocol = new Protocol();
        protocol.steps = [];
        const cleanProtocolXml = this.scrubIdsFromDocument(protocolXml);
        protocol.creator = await (await this.dbservice.getRepository(User)).findOneOrFail();
        protocol.protocolType = await (await this.dbservice.getRepository(ProtocolType)).findOneOrFail();
        protocol.protocolName = cleanProtocolXml.querySelector(":scope>field[name=protocol_name]")?.innerHTML!;
        protocol.creationDate = this.dateService.getCurrentDate();
        protocol.protocolXml = new ProtocolXml();
        protocol.protocolXml.xml = protocolXml.outerHTML
        protocol.standardTemp = parseInt(cleanProtocolXml.querySelector(":scope>field[name=temp]")!.innerHTML)
        const blockToParse = cleanProtocolXml.querySelector(":scope>statement>block")!;
        return await this.blockParser.parse(blockToParse, protocol);
    }

    private scrubIdsFromDocument(doc: Element): Element {
        const DOMParser = new JSDOM("").window.DOMParser;
        const result = new DOMParser().parseFromString(doc.outerHTML, "text/xml");
        this.scrubIdsFromElement(result.children[0])
        return result.children[0];
    }

    private scrubIdsFromElement(e: Element) {
        e.removeAttribute("id")
        for (let i = 0; i < e.children.length; i++) {
            this.scrubIdsFromElement(e.children[i])
        }
    }

}