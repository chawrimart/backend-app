import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeadDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    categoryId: number;

    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    quantity: number;

    @IsString()
    @IsOptional()
    unit?: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    budgetMin: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    budgetMax: number;

    @IsString()
    @IsOptional()
    deliveryLocation?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsDateString()
    @IsOptional()
    requiredByDate?: string;
}
