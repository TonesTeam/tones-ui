import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Protocol } from './Protocol';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    surname: string;

    @Column({ nullable: false })
    role: String;

    @OneToMany(() => Protocol, (protocol) => protocol.creator)
    protocols: Protocol[];
}
