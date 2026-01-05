import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', unsigned: true })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'subscription_id', type: 'bigint', unsigned: true, nullable: true })
    subscriptionId: number;

    @ManyToOne(() => Subscription, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'subscription_id' })
    subscription: Subscription;

    @Column({ name: 'transaction_id', unique: true, nullable: true })
    transactionId: string;

    @Column({ name: 'payment_gateway', length: 100, nullable: true })
    paymentGateway: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ length: 10, default: 'INR' })
    currency: string;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Column({ name: 'payment_method', length: 100, nullable: true })
    paymentMethod: string;

    @Column({ name: 'gateway_response', type: 'json', nullable: true })
    gatewayResponse: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
