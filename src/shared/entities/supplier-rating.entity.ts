import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BuyLead } from './buy-lead.entity';

export enum RatingStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity('supplier_ratings')
export class SupplierRating {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'supplier_id', type: 'bigint', unsigned: true })
    supplierId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supplier_id' })
    supplier: User;

    @Column({ name: 'buyer_id', type: 'bigint', unsigned: true })
    buyerId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'buyer_id' })
    buyer: User;

    @Column({ name: 'lead_id', type: 'bigint', unsigned: true, nullable: true })
    leadId: number;

    @ManyToOne(() => BuyLead, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'lead_id' })
    lead: BuyLead;

    @Column()
    rating: number; // 1-5

    @Column({ type: 'text', nullable: true })
    review: string;

    @Column({ name: 'response_time_rating', nullable: true })
    responseTimeRating: number;

    @Column({ name: 'product_quality_rating', nullable: true })
    productQualityRating: number;

    @Column({ name: 'communication_rating', nullable: true })
    communicationRating: number;

    @Column({ name: 'is_verified_purchase', default: false })
    isVerifiedPurchase: boolean;

    @Column({ type: 'enum', enum: RatingStatus, default: RatingStatus.PENDING })
    status: RatingStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
