import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../../shared/entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async findAll() {
        return this.categoriesRepository.find({
            where: { parentId: IsNull() },
            relations: ['children', 'children.children'], // up to 3 levels
        });
    }

    async findOne(id: number) {
        return this.categoriesRepository.findOne({
            where: { id },
            relations: ['children', 'parent'],
        });
    }
}
