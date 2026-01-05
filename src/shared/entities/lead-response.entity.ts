import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BuyLead } from './buy-lead.entity';
import { User } from './user.entity';

export enum LeadResponseStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity('lead_responses')
export class LeadResponse {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'lead_id', type: 'bigint', unsigned: true })
    leadId: number;

    @ManyToOne(() => BuyLead, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lead_id' })
    lead: BuyLead;

    @Column({ name: 'supplier_id', type: 'bigint', unsigned: true })
    supplierId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supplier_id' })
    supplier: User;

    @Column({ type: 'text' })
    message: string;

    @Column({ name: 'quoted_price', type: 'decimal', precision: 15, scale: 2, nullable: true })
    quotedPrice: number;

    @Column({ name: 'quoted_quantity', nullable: true })
    quotedQuantity: number;

    @Column({ name: 'quoted_unit', length: 50, nullable: true })
    quotedUnit: string;

    @Column({ name: 'delivery_time', nullable: true })
    deliveryTime: string;

    @Column({ type: 'json', nullable: true })
    attachments: any;

    @Column({ type: 'enum', enum: LeadResponseStatus, default: LeadResponseStatus.PENDING })
    status: LeadResponseStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
