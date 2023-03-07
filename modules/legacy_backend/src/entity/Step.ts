import { PrimaryGeneratedColumn, ManyToOne, Column, OneToOne, Entity, JoinColumn } from "typeorm";
import { LiquidApplication } from "./LiquidApplication";
import { Protocol } from "./Protocol";
import { TemperatureChange } from "./TemperatureChange";
import { Waiting } from "./Waiting";


export enum StepType {
    TEMPERATURE_CHANGE = "temperature_change",
    WAITING = "waiting",
    LIQUID_APPLICATION = "liquid_application"
}

@Entity()
export class Step {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => Protocol, protocol => protocol.steps, { nullable: false })
    protocol: Protocol;

    @Column({ nullable: false })
    sequenceOrder: number;

    @Column({ nullable: false })
    stepType: StepType;

    @OneToOne(() => LiquidApplication, lq => lq.step, { cascade: true })
    liquidApplication?: LiquidApplication;

    @OneToOne(() => Waiting, w => w.step, { cascade: true })
    waiting?: Waiting;

    @OneToOne(() => TemperatureChange, tc => tc.step, { cascade: true })
    temperatureChange?: TemperatureChange;

}