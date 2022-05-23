import { PrimaryGeneratedColumn, ManyToOne, Column, OneToOne, Entity } from "typeorm";
import { LiquidApplication } from "./LiquidApplication";
import { Protocol } from "./Protocol";
import { TemperatureChange } from "./TemperatureChange";
import { Waiting } from "./Waiting";


export enum StepType {
    TEMPERATURE_CHANGE = "TEMPERATURE_CHANGE",
    WAITING = "WAITING",
    LIQUID_APPLICATION = "LIQUID_APPLICATION"
}

@Entity()
export class Step {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Protocol, protocol => protocol.steps, { nullable: false })
    protocol: Protocol;

    @Column({ nullable: false })
    sequenceOrder: number;

    @Column({ nullable: false})
    stepType: StepType;

    @OneToOne(() => LiquidApplication)
    liquidApplication?: LiquidApplication;

    @OneToOne(() => Waiting)
    waiting?: Waiting;

    @OneToOne(() => TemperatureChange)
    temperatureChange?: TemperatureChange;

}