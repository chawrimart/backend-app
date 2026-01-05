import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('api/v1/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() createProductDto: CreateProductDto) {
        const product = await this.productsService.create(createProductDto, req.user.userId);
        return { success: true, data: { product } };
    }

    @Get()
    async findAll(@Query() query: any) {
        const { products, total } = await this.productsService.findAll(query);
        return { success: true, data: { products, pagination: { total } } };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const product = await this.productsService.findOne(+id);
        return { success: true, data: { product } };
    }
}
