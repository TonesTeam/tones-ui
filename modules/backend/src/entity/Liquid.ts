import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne } from "typeorm";
import { LiquidApplication } from "./LiquidApplication";

@Entity()
export class LiquidType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    typeName: string;

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
