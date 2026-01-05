import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            success: true,
            data: {
                user: {
                    id: user.uuid, // Using UUID for external reference as per PRD
                    email: user.email,
                    role: user.role,
                },
                accessToken: this.jwtService.sign(payload),
                refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
            }
        };
    }

    async register(registrationData: any) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        const newUser = await this.usersService.create({
            ...registrationData,
            passwordHash: hashedPassword,
        });
        return this.login(newUser);
    }
}
