import { Liquid } from "@entity/Liquid";
import { Protocol, PROTOCOL_STEP_RELATIONS } from "@entity/Protocol";
import { LiquidMapper } from "@mapper/LiquidMapper";
import ProtocolMapper from "@mapper/ProtocolMapper";
import { Command, CommandType, LiquidApplicationCommand } from "@service/commands/Commands";
import { CommandSerializer } from "@service/commands/CommandSerializer";
import { ProtocolCommandsMapper } from "@service/commands/ProtocolCommandsMapper";
import { DatabaseService } from "@service/DatabaseService";
import { LiquidConfigurationResolver } from "@service/deployment/LiquidConfigurationResolver";
import { ControllerMessageInterface } from "@service/external/ControllerMessageInterface";
import { Message, MessageChannel } from "@service/external/Message";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, queryParam, requestParam } from "inversify-express-utils";
import { DeploymentLiquidConfiguration } from "sharedlib/dto/liquidconfiguration.dto";

@controller("/protocol")
export default class ProtocolController extends BaseHttpController {

    @inject(DatabaseService)
    private dbService: DatabaseService;
    @inject(LiquidMapper)
    private liquidMapper: LiquidMapper;
    @inject(ProtocolMapper)
    private protocolMapper: ProtocolMapper;
    @inject(CommandSerializer)
    private commandSerializer: CommandSerializer;
    @inject(ProtocolCommandsMapper)
    private protocolCommandsMapper: ProtocolCommandsMapper;
    @inject(ControllerMessageInterface)
    private controllerMessageInterface: ControllerMessageInterface;
    @inject(LiquidConfigurationResolver)
    private liquidConfigurationResolver: LiquidConfigurationResolver;

    @httpGet("/all")
    public async allProtocols() {
        const protocols = await (await this.dbService.getRepository(Protocol)).find({
            relations: ["creator", ...PROTOCOL_STEP_RELATIONS]
        })
        return this.json(protocols.map(p => this.protocolMapper.toDto(p)), 200)
    }

    @httpGet("/:id")
    public async protocolById(@requestParam("id") id: string) {
        const protocol = await (await this.dbService.getRepository(Protocol)).findOneOrFail(parseInt(id), {
            relations: ["creator", ...PROTOCOL_STEP_RELATIONS]
        })
        return this.json(this.protocolMapper.toDto(protocol), 200)
    }

    @httpGet("/:id/xml")
    public async getProtocolXml(@requestParam("id") id: string) {
        const protocol = await (await this.dbService.getRepository(Protocol)).findOneOrFail(parseInt(id), {
            relations: ["protocolXml"]
        })
        return this.json(protocol.protocolXml.xml, 200)
    }

    @httpDelete("/:id")
    public async deleteProtocol(@requestParam("id") id: string) {
        const repo = await this.dbService.getRepository(Protocol);
        const p = await repo.findOneOrFail(parseInt(id));
        await repo.remove(p)
        return this.statusCode(200);
    }

    @httpGet("/configuration/:id")
    public async getProtocolLiquidConfiguration(@requestParam("id") id: string, @queryParam("slots") slots: string) {
        slots = slots ?? 1;
        const res = (await this.resolveProtocolConfig(id, slots))[0];
        await Promise.all(res.map(async la => la.liquid = await this.liquidMapper.toDtoFromId(la.liquidId)))
        return this.json(res, 200)
    }

    @httpGet("/start/:id")
    public async startProtocol(@requestParam("id") id: string, @queryParam("slots") slots: string) {
        slots = slots ?? 1;
        const [config, commands] = (await this.resolveProtocolConfig(id, slots));
        const body = commands
            .map(c => this.commandSerializer.serialize(c, config))
            .join(" ");
        const msg = Message.from(MessageChannel.PROTOCOL_TRANSFER, body)
        this.controllerMessageInterface.sendMsg(msg);
        //finish later
    }

    private async resolveProtocolConfig(id: string, slots: string): Promise<[DeploymentLiquidConfiguration[], Command[]]> {
        const protocol = await (await this.dbService.getRepository(Protocol)).findOneOrFail(id, { relations: PROTOCOL_STEP_RELATIONS });
        const slotArray = Array.from(Array(parseInt(slots)).keys());
        const commands = protocol.steps.flatMap(s => this.protocolCommandsMapper.stepToCommand(s, slotArray));
        let iOrder = 1;
        commands.forEach(c => c.order = iOrder++);
        const applicationCommands = commands
            .filter(c => c.commandType == CommandType.LiquidApplication)
            .map(c => c as LiquidApplicationCommand);
        const res = this.liquidConfigurationResolver.resolveLiquidConfiguration(applicationCommands);
        return [res, commands];
    }


}