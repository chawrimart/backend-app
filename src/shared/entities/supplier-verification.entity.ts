import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum VerificationType {
    BASIC = 'basic',
    TRUSTSEAL = 'trustseal',
    PREMIUM = 'premium',
}

export enum VerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

@Entity('supplier_verifications')
export class SupplierVerification {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'supplier_id', type: 'bigint', unsigned: true })
    supplierId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supplier_id' })
    supplier: User;

    @Column({ name: 'verification_type', type: 'enum', enum: VerificationType })
    verificationType: VerificationType;

    @Column({ type: 'json', nullable: true })
    documents: any;

    @Column({ name: 'verified_by', type: 'bigint', unsigned: true, nullable: true })
    verifiedBy: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'verified_by' })
    verifier: User;

    @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
    status: VerificationStatus;

    @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
    verifiedAt: Date;

    @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
    expiresAt: Date;

    @Column({ name: 'rejection_reason', type: 'text', nullable: true })
    rejectionReason: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
