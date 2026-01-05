import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'parent_id', type: 'bigint', unsigned: true, nullable: true })
    parentId: number;

    @ManyToOne(() => Category, (category) => category.children, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'icon_url', length: 500, nullable: true })
    iconUrl: string;

    @Column({ name: 'image_url', length: 500, nullable: true })
    imageUrl: string;

    @Column({ default: 1 })
    level: number;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'meta_title', nullable: true })
    metaTitle: string;

    @Column({ name: 'meta_description', type: 'text', nullable: true })
    metaDescription: string;

    @Column({ name: 'meta_keywords', type: 'text', nullable: true })
    metaKeywords: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
