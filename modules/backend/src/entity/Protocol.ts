import { AfterLoad, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProtocolXml } from "./ProtocolXml";
import { Step } from "./Step";
import { User } from "./User";

@Entity()
export class ProtocolType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    typeName: string;

    @OneToMany(() => Protocol, protocol => protocol.protocolType)
    protocols: Protocol[];

}

@Entity()
export class Protocol {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    protocolName: string;

    @CreateDateColumn()
    creationDate: Date;

    @JoinColumn()
    @OneToOne(() => ProtocolXml, { cascade: true })
    protocolXml: ProtocolXml;

    @Column()
    comment: string;

    @ManyToOne(() => User, user => user.protocols)
    creator: User;

    @Column({ nullable: false })
    standardTemp: number;

    @ManyToOne(() => ProtocolType, protocolType => protocolType.protocols)
    protocolType: ProtocolType;

    @OneToMany(() => Step, step => step.protocol, { cascade: true })
    steps: Step[];

}