import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Protocol } from "./Protocol";


@Entity()
export class ProtocolXml {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    xml: string;

    @OneToOne(() => Protocol)
    protocol: Protocol;
}
