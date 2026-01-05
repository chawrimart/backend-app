import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationChannel {
    IN_APP = 'in_app',
    EMAIL = 'email',
    SMS = 'sms',
    WHATSAPP = 'whatsapp',
}

export enum NotificationStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed',
    READ = 'read',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', unsigned: true })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ length: 100 })
    type: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'json', nullable: true })
    data: any;

    @Column({ type: 'enum', enum: NotificationChannel })
    channel: NotificationChannel;

    @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
    status: NotificationStatus;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @Column({ name: 'read_at', type: 'timestamp', nullable: true })
    readAt: Date;

    @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
    sentAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
