import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class ProtocolType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    typeName: string;

    @OneToMany(() => Protocol, protocol => protocol.protocolType)
    protocols: Protocol[];

}

@Entity()
export class Protocol {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    protocolName: string;

    @CreateDateColumn()
    creationDate: Date;

    @Column()
    protocolString: string;

    @Column()
    comment: string;

    @ManyToOne(() => User, user => user.protocols)
    creator: User;

    @Column()
    standardTemp: number;

    @ManyToOne(() => ProtocolType, protocolType => protocolType.protocols)
    protocolType: ProtocolType;

}