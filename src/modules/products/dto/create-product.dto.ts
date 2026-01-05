import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PriceType, StockStatus } from '../../../shared/entities/product.entity';

export class CreateProductDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    categoryId: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    minOrderQuantity?: number;

    @IsString()
    @IsOptional()
    unit?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    price?: number;

    @IsString()
    @IsOptional()
    priceUnit?: string;

    @IsEnum(PriceType)
    @IsOptional()
    priceType?: PriceType;

    @IsEnum(StockStatus)
    @IsOptional()
    stockStatus?: StockStatus;

    @IsOptional()
    specifications?: any;
}
