import { Liquid } from "@entity/Liquid";
import { LiquidMapper } from "@mapper/liquid.mapper";
import { DatabaseService } from "@service/database.service";
import { inject } from "inversify";
import { BaseHttpController, Controller, controller, httpGet, httpPost, request, response } from "inversify-express-utils";
import * as express from "express";
import {JSDOM} from "jsdom";
import { ProtocolXmlParsingService } from "@service/protocolxmlparsing.service";
import { Protocol } from "@entity/Protocol";


@controller("")
export class BlocklyController extends BaseHttpController implements Controller {

    @inject(DatabaseService)
    dbservice: DatabaseService;
    @inject(LiquidMapper)
    liquidMapper: LiquidMapper;
    @inject(ProtocolXmlParsingService)
    protocolParsingService: ProtocolXmlParsingService;

    @httpGet("/liquids")
    public async liquids() {
        const repo = await this.dbservice.getRepository(Liquid)
        const all = await repo.find({ relations: ["liquidType", "liquidSubType"] })
        return this.json(all.map(this.liquidMapper.toDto), 200)
    }

    @httpPost("/protocol")
    public async saveProtocol(@request() req: express.Request, @response() res: express.Response) {
        const DOMParser = new JSDOM("").window.DOMParser;
        const doc = new DOMParser().parseFromString(req.body,"text/xml");
        const protocolXml = doc.querySelector('[type=begin_protocol]')!;
        console.log(protocolXml?.outerHTML);
        // const protocol = this.protocolParsingService.parseProtocolXml(protocolXml);
        // (await this.dbservice.getRepository(Protocol)).save(protocol)
    }
}