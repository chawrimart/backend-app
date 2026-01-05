import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVideo } from './product-video.entity';

export enum PriceType {
    FIXED = 'fixed',
    NEGOTIABLE = 'negotiable',
    RFQ = 'rfq',
}

export enum StockStatus {
    IN_STOCK = 'in_stock',
    OUT_OF_STOCK = 'out_of_stock',
    MADE_TO_ORDER = 'made_to_order',
}

export enum ProductStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    REJECTED = 'rejected',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ unique: true, type: 'char', length: 36 })
    uuid: string;

    @Column({ name: 'supplier_id', type: 'bigint', unsigned: true })
    supplierId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supplier_id' })
    supplier: User;

    @Column({ name: 'category_id', type: 'bigint', unsigned: true })
    categoryId: number;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ length: 500 })
    name: string;

    @Column({ unique: true, length: 500 })
    slug: string;

    @Column({ length: 100, nullable: true })
    sku: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    specifications: any;

    @Column({ name: 'min_order_quantity', default: 1 })
    minOrderQuantity: number;

    @Column({ length: 50, nullable: true })
    unit: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    price: number;

    @Column({ name: 'price_unit', length: 50, nullable: true })
    priceUnit: string;

    @Column({ name: 'price_type', type: 'enum', enum: PriceType, default: PriceType.NEGOTIABLE })
    priceType: PriceType;

    @Column({ name: 'stock_status', type: 'enum', enum: StockStatus, default: StockStatus.IN_STOCK })
    stockStatus: StockStatus;

    @Column({ name: 'is_featured', default: false })
    isFeatured: boolean;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ name: 'view_count', default: 0 })
    viewCount: number;

    @Column({ name: 'inquiry_count', default: 0 })
    inquiryCount: number;

    @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.PENDING })
    status: ProductStatus;

    @Column({ name: 'rejection_reason', type: 'text', nullable: true })
    rejectionReason: string;

    @Column({ name: 'published_at', type: 'timestamp', nullable: true })
    publishedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;

    @OneToMany(() => ProductImage, (image) => image.product)
    images: ProductImage[];

    @OneToMany(() => ProductVideo, (video) => video.product)
    videos: ProductVideo[];
}
