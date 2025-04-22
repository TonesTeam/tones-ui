import {
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
    Entity,
} from 'typeorm';
import { Liquid } from './Liquid';
import { Step } from './Step';

@Entity()
export class LiquidApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => Liquid, (liquid) => liquid.liquidApplications, {
        nullable: false,
    })
    liquid: Liquid;

    @JoinColumn()
    @OneToOne(() => Step, (step) => step.liquidApplication, { nullable: false })
    step: Step;
}
