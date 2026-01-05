import { Controller, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('api/v1/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.usersService.findOne(req.user.userId);
        // In a real app, we would load profile relation here
        return { success: true, data: { user } };
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
        // Implement update logic in service
        return { success: true, message: 'Profile updated' };
    }

    @Get(':userId/public-profile')
    async getPublicProfile(@Param('userId') userId: string) {
        // Implement public profile fetch
        return { success: true, data: { userId } };
    }
}
