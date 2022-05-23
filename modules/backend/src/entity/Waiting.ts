import { PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Entity } from "typeorm";
import { Step } from "./Step";

@Entity()
export class Waiting {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    waitingTime: number;

    @JoinColumn()
    @OneToOne(() => Step, { nullable: false })
    step: Step;
}
