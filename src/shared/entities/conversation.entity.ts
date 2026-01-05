import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { BuyLead } from './buy-lead.entity';
import { Message } from './message.entity';

@Entity('conversations')
@Unique(['buyerId', 'supplierId'])
export class Conversation {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ unique: true, type: 'char', length: 36 })
    uuid: string;

    @Column({ name: 'buyer_id', type: 'bigint', unsigned: true })
    buyerId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'buyer_id' })
    buyer: User;

    @Column({ name: 'supplier_id', type: 'bigint', unsigned: true })
    supplierId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supplier_id' })
    supplier: User;

    @Column({ name: 'product_id', type: 'bigint', unsigned: true, nullable: true })
    productId: number;

    @ManyToOne(() => Product, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'lead_id', type: 'bigint', unsigned: true, nullable: true })
    leadId: number;

    @ManyToOne(() => BuyLead, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'lead_id' })
    lead: BuyLead;

    @Column({ name: 'last_message_at', type: 'timestamp', nullable: true })
    lastMessageAt: Date;

    @Column({ name: 'last_message_preview', type: 'text', nullable: true })
    lastMessagePreview: string;

    @Column({ name: 'is_archived_buyer', default: false })
    isArchivedBuyer: boolean;

    @Column({ name: 'is_archived_supplier', default: false })
    isArchivedSupplier: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];
}
