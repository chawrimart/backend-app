import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BuyLead } from './buy-lead.entity';
import { User } from './user.entity';

export enum DistributionStatus {
    SENT = 'sent',
    VIEWED = 'viewed',
    CONTACTED = 'contacted',
    QUOTED = 'quoted',
    CLOSED = 'closed',
    IRRELEVANT = 'irrelevant',
}

@Entity('lead_distributions')
@Unique(['leadId', 'supplierId'])
export class LeadDistribution {
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

    @Column({ name: 'distribution_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
    distributionScore: number;

    @Column({ name: 'is_purchased', default: false })
    isPurchased: boolean;

    @Column({ name: 'purchased_at', type: 'timestamp', nullable: true })
    purchasedAt: Date;

    @Column({ type: 'enum', enum: DistributionStatus, default: DistributionStatus.SENT })
    status: DistributionStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
