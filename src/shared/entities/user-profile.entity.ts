import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', unsigned: true })
    userId: number;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'company_name', nullable: true })
    companyName: string;

    @Column({ name: 'company_type', type: 'enum', enum: ['manufacturer', 'wholesaler', 'distributor', 'retailer', 'service_provider'], nullable: true })
    companyType: string;

    @Column({ name: 'gst_number', length: 20, nullable: true })
    gstNumber: string;

    @Column({ name: 'pan_number', length: 10, nullable: true })
    panNumber: string;

    @Column({ name: 'business_description', type: 'text', nullable: true })
    businessDescription: string;

    @Column({ name: 'address_line1', nullable: true })
    addressLine1: string;

    @Column({ name: 'address_line2', nullable: true })
    addressLine2: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ default: 'India' })
    country: string;

    @Column({ nullable: true, length: 10 })
    pincode: string;

    @Column({ name: 'website_url', nullable: true })
    websiteUrl: string;

    @Column({ name: 'logo_url', length: 500, nullable: true })
    logoUrl: string;

    @Column({ name: 'cover_image_url', length: 500, nullable: true })
    coverImageUrl: string;

    @Column({ name: 'year_established', type: 'year', nullable: true })
    yearEstablished: number;

    @Column({ name: 'employee_count', type: 'enum', enum: ['1-10', '11-50', '51-200', '201-500', '500+'], nullable: true })
    employeeCount: string;

    @Column({ name: 'annual_turnover', type: 'enum', enum: ['<1Cr', '1-5Cr', '5-10Cr', '10-50Cr', '50Cr+'], nullable: true })
    annualTurnover: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
