import { Liquid } from "@entity/Liquid";
import { provide } from "inversify-binding-decorators";
import { LiquidDto } from "sharedlib/dto/liquid.dto"

@provide(LiquidMapper)
export class LiquidMapper {

    public toDto(l: Liquid): LiquidDto {
        return {
            name: l.liquidName,
            type: l.liquidType.typeName,
            subType: l.liquidSubType?.subTypeName,
        };
    }

}