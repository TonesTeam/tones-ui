import {
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    Entity,
} from 'typeorm';
import { Step } from './Step';

@Entity()
export class TemperatureChange {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    targetTemperature: number;

    @Column({ nullable: false })
    blocking: boolean;

    @JoinColumn()
    @OneToOne(() => Step, (step) => step.temperatureChange, { nullable: false })
    step: Step;
}
