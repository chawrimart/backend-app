import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('api/v1/leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() createLeadDto: CreateLeadDto) {
        const lead = await this.leadsService.create(createLeadDto, req.user.userId);
        return { success: true, data: { lead } };
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-leads')
    async getMyLeads(@Request() req) {
        const leads = await this.leadsService.findMyLeads(req.user.userId);
        return { success: true, data: { leads } };
    }

    @Get('available')
    async getAvailableLeads(@Query() query: any) {
        const leads = await this.leadsService.findAvailableLeads(query);
        return { success: true, data: { leads } };
    }
}
