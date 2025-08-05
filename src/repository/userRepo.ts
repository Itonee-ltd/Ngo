// src/repository/userRepo.ts
import { BaseRepository, TDoc } from './baseRepo';
import UserModel from '../models/User';
import { IUser } from '../interface';
import { FilterQuery } from 'mongoose';

class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }

    // Alias methods to match your existing code patterns
    async byQuery(filter: FilterQuery<IUser>): Promise<TDoc<IUser> | null> {
        return this.findOne(filter);
    }

    async byID(id: string): Promise<TDoc<IUser> | null> {
        return this.findById(id);
    }

    async update(id: string, data: Partial<IUser>): Promise<TDoc<IUser> | null> {
        return this.updateById(id, data);
    }

    // Get all users with pagination
    async all(filter: FilterQuery<IUser> = {}, options?: any): Promise<TDoc<IUser>[]> {
        return this.find({
            ...filter,
            isDeleted: false
        }, undefined, options);
    }

    // Get active users only
    async getActiveUsers(): Promise<TDoc<IUser>[]> {
        return this.find({
            isActive: true,
            isDeleted: false
        });
    }

    // Get users by role
    // async getUsersByRole(role: UserRoleEnum): Promise<TDoc<IUser>[]> {
    //     return this.find({
    //         role,
    //         isDeleted: false
    //     });
    // }

    // Find user by email (including password for authentication)
    async findByEmailWithPassword(email: string): Promise<TDoc<IUser> | null> {
        try {
            const user = await this.model.findOne({ 
                email: email.toLowerCase(),
                isDeleted: false 
            }).select('+password').exec();
            return user as unknown as TDoc<IUser> | null;
        } catch (error) {
            throw error;
        }
    }

    // Find user with verification token
    async findByVerificationToken(email: string, token: string): Promise<TDoc<IUser> | null> {
        try {
            const user = await this.model.findOne({
                email: email.toLowerCase(),
                emailVerificationToken: token,
                emailVerificationTokenExpiry: { $gt: new Date() },
                isDeleted: false
            }).select('+emailVerificationToken +emailVerificationTokenExpiry').exec();
            return user as unknown as TDoc<IUser> | null;
        } catch (error) {
            throw error;
        }
    }

    // Find user with reset token
    async findByResetToken(email: string, token: string): Promise<TDoc<IUser> | null> {
        try {
            const user = await this.model.findOne({
                email: email.toLowerCase(),
                resetPasswordToken: token,
                resetPasswordTokenExpiry: { $gt: new Date() },
                isDeleted: false
            }).select('+resetPasswordToken +resetPasswordTokenExpiry').exec();
            return user as unknown as TDoc<IUser> | null;
        } catch (error) {
            throw error;
        }
    }

    // Soft delete user
    async softDelete(id: string): Promise<TDoc<IUser> | null> {
        return this.updateById(id, {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false
        });
    }

    // Restore soft deleted user
    async restore(id: string): Promise<TDoc<IUser> | null> {
        return this.updateById(id, {
            isDeleted: false,
            deletedAt: undefined,
            isActive: true
        });
    }
}

export const userRepo = new UserRepository();
export default UserRepository;