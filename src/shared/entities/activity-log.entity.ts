import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('activity_logs')
export class ActivityLog {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', unsigned: true, nullable: true })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ length: 100 })
    action: string;

    @Column({ name: 'entity_type', length: 100, nullable: true })
    entityType: string;

    @Column({ name: 'entity_id', type: 'bigint', unsigned: true, nullable: true })
    entityId: number;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @Column({ name: 'ip_address', length: 45, nullable: true })
    ipAddress: string;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
