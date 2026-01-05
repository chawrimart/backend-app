import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../shared/entities/product.entity';
import { ProductImage } from '../../shared/entities/product-image.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private productImagesRepository: Repository<ProductImage>,
    ) { }

    async create(createProductDto: any, supplierId: number) {
        const product = this.productsRepository.create({
            ...createProductDto,
            supplierId,
            uuid: uuidv4(),
            slug: createProductDto.slug || uuidv4(), // simplified slug generation
        });
        return this.productsRepository.save(product);
    }

    async findAll(query: any) {
        const { q, categoryId } = query;
        const where: any = {};
        if (q) {
            where.name = Like(`%${q}%`);
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        const [products, total] = await this.productsRepository.findAndCount({
            where,
            relations: ['supplier', 'images'],
            take: 20,
            skip: 0,
        });
        return { products, total };
    }

    async findOne(id: number) {
        return this.productsRepository.findOne({
            where: { id },
            relations: ['supplier', 'images', 'videos', 'category'],
        });
    }
}
