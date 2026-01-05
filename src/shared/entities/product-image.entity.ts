import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'product_id', type: 'bigint', unsigned: true })
    productId: number;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'image_url', length: 500 })
    imageUrl: string;

    @Column({ name: 'thumbnail_url', length: 500, nullable: true })
    thumbnailUrl: string;

    @Column({ name: 'alt_text', nullable: true })
    altText: string;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @Column({ name: 'is_primary', default: false })
    isPrimary: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
