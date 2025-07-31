import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Medicine } from "../medicines/medicine.entity";

@Entity("cids")
export class Cid {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string; // Código do CID (ex: F41.1)

    @Column()
    name: string; // Nome da doença/condição

    @Column({ type: "text", nullable: true })
    description: string; // Descrição detalhada

    @Column({ nullable: true })
    category: string; // Categoria do CID

    @ManyToMany(() => Medicine, { cascade: true })
    @JoinTable({
        name: "cid_medicines",
        joinColumn: {
            name: "cid_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "medicine_id",
            referencedColumnName: "id",
        },
    })
    medicines: Medicine[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 