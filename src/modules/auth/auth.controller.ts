import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() signInDto: LoginDto) {
        const user = await this.authService.validateUser(signInDto.email, signInDto.password);
        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }
        return this.authService.login(user); // user is the entity minus password
    }

    @Post('register')
    async register(@Body() signUpDto: CreateUserDto) {
        return this.authService.register(signUpDto);
    }
}
