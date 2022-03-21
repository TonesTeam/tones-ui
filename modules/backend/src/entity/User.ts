import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Protocol } from "./Protocol";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    role: String;

    @OneToMany(() => Protocol, protocol => protocol.creator)
    protocols: Protocol[];
}