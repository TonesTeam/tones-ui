import { PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, Entity } from "typeorm";
import { Liquid } from "./Liquid";
import { Step } from "./Step";


@Entity()
export class LiquidApplication {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Liquid, liquid => liquid.liquidApplications, { nullable: false })
    liquid: Liquid;

    @JoinColumn()
    @OneToOne(() => Step, { nullable: false })
    step: Step;
}
