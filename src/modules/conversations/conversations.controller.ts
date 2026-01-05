import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('api/v1/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createDto: CreateConversationDto) {
    // In real app, we handle logic based on who is creating (buyer/supplier)
    const conversation = await this.conversationsService.create(createDto, req.user.userId);
    return { success: true, data: { conversation } };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    const conversations = await this.conversationsService.findAll(req.user.userId);
    return { success: true, data: { conversations } };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const conversation = await this.conversationsService.findOne(+id);
    return { success: true, data: { conversation } };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/messages')
  async sendMessage(@Request() req, @Param('id') id: string, @Body() body: SendMessageDto) {
    const message = await this.conversationsService.sendMessage(+id, req.user.userId, body.message);
    return { success: true, data: { message } };
  }
}
