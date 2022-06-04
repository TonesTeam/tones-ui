import { LiquidTypeName } from "sharedlib/enum/LiquidTypes";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, EntityRepository, Repository } from "typeorm";
import { LiquidApplication } from "./LiquidApplication";

@Entity()
export class LiquidType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    typeName: LiquidTypeName;

    @OneToMany(() => Liquid, liquid => liquid.liquidType)
    liquids: Liquid[];
}

@Entity()
export class LiquidSubType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    subTypeName: string;

    @OneToMany(() => Liquid, liquid => liquid.liquidSubType)
    liquids: Liquid[];

}

@Entity()
export class Liquid {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    liquidName: string;

    @ManyToOne(() => LiquidType, liquidType => liquidType.liquids, { nullable: false })
    liquidType: LiquidType;

    @ManyToOne(() => LiquidSubType, liquidSubType => liquidSubType.liquids, { nullable: true })
    liquidSubType: LiquidSubType;

    @OneToMany(() => LiquidApplication, liquidApplication => liquidApplication.liquid)
    liquidApplications: LiquidApplication[];

}

// @EntityRepository(Liquid)
// export class LiquidRepository extends Repository<Liquid> {}
