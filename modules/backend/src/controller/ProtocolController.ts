import { Protocol } from "@entity/Protocol";
import ProtocolMapper from "@mapper/ProtocolMapper";
import { DatabaseService } from "@service/DatabaseService";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet } from "inversify-express-utils";

@controller("/protocol")
export default class ProtocolController extends BaseHttpController {

    @inject(DatabaseService)
    private dbService: DatabaseService;
    @inject(ProtocolMapper)
    protocolMapper: ProtocolMapper;

    @httpGet("/all")
    public async allProtocols() {
        const protocols = await (await this.dbService.getRepository(Protocol)).find({
            relations: ["creator", "steps", "steps.liquidApplication",
                "steps.liquidApplication.liquid", "steps.liquidApplication.liquid.liquidType"]
        })
        return this.json(protocols.map(p => this.protocolMapper.toDto(p)), 200)
    }

}