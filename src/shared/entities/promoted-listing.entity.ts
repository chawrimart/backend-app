import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

export enum PromotionType {
    FEATURED = 'featured',
    TOP_SEARCH = 'top_search',
    CATEGORY_TOP = 'category_top',
}

export enum PromotionStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('promoted_listings')
export class PromotedListing {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'product_id', type: 'bigint', unsigned: true })
    productId: number;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'supplier_id', type: 'bigint', unsigned: true })
    supplierId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supplier_id' })
    supplier: User;

    @Column({ name: 'promotion_type', type: 'enum', enum: PromotionType })
    promotionType: PromotionType;

    @Column({ name: 'daily_budget', type: 'decimal', precision: 10, scale: 2, nullable: true })
    dailyBudget: number;

    @Column({ name: 'total_spent', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    totalSpent: number;

    @Column({ default: 0 })
    impressions: number;

    @Column({ default: 0 })
    clicks: number;

    @Column({ type: 'enum', enum: PromotionStatus, default: PromotionStatus.ACTIVE })
    status: PromotionStatus;

    @Column({ name: 'starts_at', type: 'timestamp' })
    startsAt: Date;

    @Column({ name: 'expires_at', type: 'timestamp' })
    expiresAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
