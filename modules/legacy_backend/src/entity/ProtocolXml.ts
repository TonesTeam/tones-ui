import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Protocol } from './Protocol';

@Entity()
export class ProtocolXml {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    xml: string;

    @JoinColumn()
    @OneToOne(() => Protocol, (protocol) => protocol.protocolXml, {
        nullable: false,
    })
    protocol: Protocol;
}
