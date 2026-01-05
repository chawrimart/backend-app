import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CategoriesService } from './categories.service';

@Controller('api/v1/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @UseInterceptors(CacheInterceptor)
    @Get()
    async findAll() {
        const categories = await this.categoriesService.findAll();
        return { success: true, data: { categories } };
    }

    @UseInterceptors(CacheInterceptor)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const category = await this.categoriesService.findOne(+id);
        return { success: true, data: { category } };
    }
}
