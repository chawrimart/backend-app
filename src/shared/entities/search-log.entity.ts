import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('search_logs')
export class SearchLog {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', unsigned: true, nullable: true })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'search_query', length: 500 })
    searchQuery: string;

    @Column({ type: 'json', nullable: true })
    filters: any;

    @Column({ name: 'results_count', default: 0 })
    resultsCount: number;

    @Column({ name: 'clicked_product_id', type: 'bigint', unsigned: true, nullable: true })
    clickedProductId: number;

    @ManyToOne(() => Product, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'clicked_product_id' })
    clickedProduct: Product;

    @Column({ name: 'session_id', length: 255, nullable: true })
    sessionId: string;

    @Column({ name: 'ip_address', length: 45, nullable: true })
    ipAddress: string;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
