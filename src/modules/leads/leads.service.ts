import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BuyLead, LeadStatus } from '../../shared/entities/buy-lead.entity';

@Injectable()
export class LeadsService {
    constructor(
        @InjectRepository(BuyLead)
        private leadsRepository: Repository<BuyLead>,
    ) { }

    async create(createLeadDto: any, buyerId: number) {
        const lead = this.leadsRepository.create({
            ...createLeadDto,
            buyerId,
            uuid: uuidv4(),
            status: LeadStatus.OPEN,
        });
        return this.leadsRepository.save(lead);
    }

    async findMyLeads(buyerId: number) {
        return this.leadsRepository.find({
            where: { buyerId },
            order: { createdAt: 'DESC' },
        });
    }

    async findAvailableLeads(query: any) {
        // Basic implementation: find all open leads
        return this.leadsRepository.find({
            where: { status: LeadStatus.OPEN },
            take: 20,
            relations: ['buyer', 'category'],
        });
    }
}
