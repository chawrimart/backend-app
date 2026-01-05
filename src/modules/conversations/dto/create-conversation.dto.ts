import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConversationDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    recipientId: number; // Assuming we pass supplierId

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    productId?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    leadId?: number;

    @IsString()
    @IsNotEmpty()
    message: string;
}
