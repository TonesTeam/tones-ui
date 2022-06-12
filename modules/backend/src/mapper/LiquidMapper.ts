import { Liquid } from "@entity/Liquid";
import { DatabaseService } from "@service/DatabaseService";
import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { LiquidDto } from "sharedlib/dto/liquid.dto"

@provide(LiquidMapper)
export class LiquidMapper {

    @inject(DatabaseService)
    private dbService: DatabaseService;

    public async toDtoFromId(liquidId: number): Promise<LiquidDto> {
        const liquid = await (await this.dbService.getRepository(Liquid))
            .findOneOrFail(liquidId, { relations: ["liquidType", "liquidSubType"] });
        return this.toDto(liquid);
    }

    public toDto(l: Liquid): LiquidDto {
        return {
            name: l.liquidName,
            type: l.liquidType.typeName,
            subType: l.liquidSubType?.subTypeName,
        };
    }

}