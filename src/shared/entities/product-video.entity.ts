import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum VideoType {
    UPLOAD = 'upload',
    YOUTUBE = 'youtube',
    VIMEO = 'vimeo',
}

@Entity('product_videos')
export class ProductVideo {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'product_id', type: 'bigint', unsigned: true })
    productId: number;

    @ManyToOne(() => Product, (product) => product.videos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'video_url', length: 500 })
    videoUrl: string;

    @Column({ name: 'thumbnail_url', length: 500, nullable: true })
    thumbnailUrl: string;

    @Column({ name: 'video_type', type: 'enum', enum: VideoType, default: VideoType.UPLOAD })
    videoType: VideoType;

    @Column({ nullable: true })
    duration: number;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
