import { Liquid } from '@entity/Liquid';
import { LiquidMapper } from '@mapper/LiquidMapper';
import { DatabaseService } from '@service/DatabaseService';
import { inject } from 'inversify';
import {
    BaseHttpController,
    Controller,
    controller,
    httpGet,
    httpPost,
    httpPut,
    request,
    requestParam,
    response,
} from 'inversify-express-utils';
import * as express from 'express';
import { JSDOM } from 'jsdom';
import { ProtocolXmlParsingService } from '@service/ProtocolXmlParsingService';
import { Protocol, PROTOCOL_STEP_RELATIONS } from '@entity/Protocol';
import { safeJSONSerialize } from '@util/JSONSerializer';
import { Logger } from 'tslog';

@controller('/blockly')
export class BlocklyController
    extends BaseHttpController
    implements Controller
{
    @inject(Logger)
    private logger: Logger;
    @inject(DatabaseService)
    private dbservice: DatabaseService;
    @inject(LiquidMapper)
    private liquidMapper: LiquidMapper;
    @inject(ProtocolXmlParsingService)
    private protocolParsingService: ProtocolXmlParsingService;

    @httpGet('/liquids')
    public async liquids() {
        const repo = await this.dbservice.getRepository(Liquid);
        const all = await repo.find({
            relations: ['liquidType', 'liquidSubType'],
        });
        return this.json(all.map(this.liquidMapper.toDto), 200);
    }

    @httpPost('/protocol')
    public async saveProtocol(
        @request() req: express.Request,
        @response() res: express.Response,
    ) {
        const DOMParser = new JSDOM('').window.DOMParser;
        const doc = new DOMParser().parseFromString(req.body, 'text/xml');
        const protocolXml = doc.querySelector('[type=begin_protocol]')!;
        const pr =
            await this.protocolParsingService.createProtocolFromXml(
                protocolXml,
            );
        await (await this.dbservice.getRepository(Protocol)).save(pr);
        res.status(200).send(pr.id.toString());
    }

    @httpPut('/protocol/:id')
    public async updateProtocol(
        @requestParam('id') id: string,
        @request() req: express.Request,
        @response() res: express.Response,
    ) {
        const DOMParser = new JSDOM('').window.DOMParser;
        const doc = new DOMParser().parseFromString(req.body, 'text/xml');
        const createdProtocol =
            await this.protocolParsingService.createProtocolFromXml(
                doc.querySelector('[type=begin_protocol]')!,
            );
        createdProtocol.id = parseInt(id);
        await (
            await this.dbservice.getConnection()
        ).transaction<Protocol>(async (em) => {
            const p = await em.findOneOrFail(Protocol, parseInt(id), {
                relations: PROTOCOL_STEP_RELATIONS,
            });
            await em.remove<Protocol>(p);
            return em.save<Protocol>(createdProtocol);
        });
        res.status(200).send(safeJSONSerialize(createdProtocol));
    }
}
