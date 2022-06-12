import { Liquid } from "@entity/Liquid";
import { Protocol } from "@entity/Protocol";
import { LiquidMapper } from "@mapper/LiquidMapper";
import ProtocolMapper from "@mapper/ProtocolMapper";
import { CommandType, LiquidApplicationCommand } from "@service/commands/Commands";
import { ProtocolCommandsMapper } from "@service/commands/ProtocolCommandsMapper";
import { DatabaseService } from "@service/DatabaseService";
import { LiquidConfigurationResolver } from "@service/deployment/LiquidConfigurationResolver";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, queryParam, requestParam } from "inversify-express-utils";

@controller("/protocol")
export default class ProtocolController extends BaseHttpController {

    @inject(DatabaseService)
    private dbService: DatabaseService;
    @inject(LiquidMapper)
    private liquidMapper: LiquidMapper;
    @inject(ProtocolMapper)
    private protocolMapper: ProtocolMapper;
    @inject(ProtocolCommandsMapper)
    private protocolCommandsMapper: ProtocolCommandsMapper;
    @inject(LiquidConfigurationResolver)
    private liquidConfigurationResolver: LiquidConfigurationResolver;

    @httpGet("/all")
    public async allProtocols() {
        const protocols = await (await this.dbService.getRepository(Protocol)).find({
            relations: ["creator", "steps", "steps.liquidApplication",
                "steps.liquidApplication.liquid", "steps.liquidApplication.liquid.liquidType"]
        })
        return this.json(protocols.map(p => this.protocolMapper.toDto(p)), 200)
    }

    @httpGet("/configuration/:id")
    public async getProtocolLiquidConfiguration(@requestParam("id") id: string, @queryParam("slots") slots: string) {
        slots = slots ?? 1;
        const protocol = await (await this.dbService.getRepository(Protocol)).findOneOrFail(id, {
            relations: ["steps", "steps.liquidApplication", "steps.waiting", "steps.temperatureChange",
                "steps.liquidApplication.liquid", "steps.liquidApplication.liquid.liquidType"]
        });
        const slotArray = Array.from(Array(parseInt(slots)).keys())
        const commands = protocol.steps.flatMap(s => this.protocolCommandsMapper.stepToCommand(s, slotArray));
        let iOrder = 1;
        commands.forEach(c => c.order = iOrder++);
        const applicationCommands = commands
            .filter(c => c.commandType == CommandType.LiquidApplication)
            .map(c => c as LiquidApplicationCommand)
        const res = this.liquidConfigurationResolver.resolveLiquidConfiguration(applicationCommands)
        await Promise.all(res.map(async la => la.liquid = await this.liquidMapper.toDtoFromId(la.liquidId)))
        return this.json(res, 200)
    }

}