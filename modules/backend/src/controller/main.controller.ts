import { Liquid } from "@entity/Liquid";
import { LiquidMapper } from "@mapper/liquid.mapper";
import { DatabaseService } from "@service/database.service";
import { inject, injectable } from "inversify";
import { provide } from "inversify-binding-decorators";
import { BaseHttpController, controller, httpGet } from "inversify-express-utils";

@controller("")
export class MainController extends BaseHttpController {

    @inject(DatabaseService)
    dbservice: DatabaseService;
    @inject(LiquidMapper)
    liquidMapper: LiquidMapper;

    @httpGet("/liquids")
    public async test() {
        const repo = await this.dbservice.getRepository(Liquid)
        const all = await repo.find({ relations: ["liquidType", "liquidSubType"] })
        return this.json(all.map(this.liquidMapper.toDto), 200)
    }
}