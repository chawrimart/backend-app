import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum PlanType {
    FREE = 'free',
    BASIC = 'basic',
    PREMIUM = 'premium',
    ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
    SUSPENDED = 'suspended',
}

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', unsigned: true })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'plan_type', type: 'enum', enum: PlanType })
    planType: PlanType;

    @Column({ type: 'json', nullable: true })
    features: any;

    @Column({ name: 'lead_limit', default: 0 })
    leadLimit: number;

    @Column({ name: 'product_limit', default: 0 })
    productLimit: number;

    @Column({ name: 'featured_products_limit', default: 0 })
    featuredProductsLimit: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    price: number;

    @Column({ length: 10, default: 'INR' })
    currency: string;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
    status: SubscriptionStatus;

    @Column({ name: 'starts_at', type: 'timestamp' })
    startsAt: Date;

    @Column({ name: 'expires_at', type: 'timestamp' })
    expiresAt: Date;

    @Column({ name: 'auto_renew', default: false })
    autoRenew: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
