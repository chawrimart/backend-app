import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '../../shared/entities/conversation.entity';
import { Message } from '../../shared/entities/message.entity';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationsRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
    ) { }

    async create(createDto: any, userId: number) {
        const conversation = this.conversationsRepository.create({
            ...createDto,
            buyerId: userId, // Assuming creator is buyer for now, logic might differ based on role
            uuid: uuidv4(),
        });
        return this.conversationsRepository.save(conversation);
    }

    async findAll(userId: number) {
        return this.conversationsRepository.find({
            where: [
                { buyerId: userId },
                { supplierId: userId },
            ],
            relations: ['buyer', 'supplier', 'product'],
            order: { lastMessageAt: 'DESC' },
        });
    }

    async findOne(id: number) {
        return this.conversationsRepository.findOne({
            where: { id },
            relations: ['messages', 'messages.sender', 'buyer', 'supplier', 'product'],
        });
    }

    async sendMessage(conversationId: number, senderId: number, content: string) {
        const conversation = await this.findOne(conversationId);
        if (!conversation) throw new NotFoundException('Conversation not found');

        const message = this.messagesRepository.create({
            conversationId,
            senderId,
            receiverId: conversation.buyerId === senderId ? conversation.supplierId : conversation.buyerId,
            message: content,
        });

        await this.messagesRepository.save(message);

        // Update conversation last message
        conversation.lastMessageAt = new Date();
        conversation.lastMessagePreview = content.substring(0, 50);
        await this.conversationsRepository.save(conversation);

        return message;
    }
}
