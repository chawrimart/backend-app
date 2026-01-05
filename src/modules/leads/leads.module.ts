import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { BuyLead } from '../../shared/entities/buy-lead.entity';
import { LeadDistribution } from '../../shared/entities/lead-distribution.entity';
import { LeadResponse } from '../../shared/entities/lead-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BuyLead, LeadDistribution, LeadResponse])],
  providers: [LeadsService],
  controllers: [LeadsController],
  exports: [LeadsService],
})
export class LeadsModule { }
