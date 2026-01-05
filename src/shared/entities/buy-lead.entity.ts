import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

export enum LeadStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}

@Entity('buy_leads')
export class BuyLead {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ unique: true, type: 'char', length: 36 })
    uuid: string;

    @Column({ name: 'buyer_id', type: 'bigint', unsigned: true })
    buyerId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'buyer_id' })
    buyer: User;

    @Column({ name: 'category_id', type: 'bigint', unsigned: true })
    categoryId: number;

    @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'product_name', length: 500 })
    productName: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    quantity: number;

    @Column({ length: 50, nullable: true })
    unit: string;

    @Column({ name: 'budget_min', type: 'decimal', precision: 15, scale: 2, nullable: true })
    budgetMin: number;

    @Column({ name: 'budget_max', type: 'decimal', precision: 15, scale: 2, nullable: true })
    budgetMax: number;

    @Column({ name: 'delivery_location', nullable: true })
    deliveryLocation: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ name: 'required_by_date', type: 'date', nullable: true })
    requiredByDate: Date;

    @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.OPEN })
    status: LeadStatus;

    @Column({ name: 'view_count', default: 0 })
    viewCount: number;

    @Column({ name: 'response_count', default: 0 })
    responseCount: number;

    @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
    expiresAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
