// src/interface/index.ts
import { Request } from 'express';
import { Document } from 'mongoose';

// User Role Enum
export enum UserRoleEnum {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

// Address Interface
export interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

// Identity Verification Interface
export interface IIdentityVerification {
    idType?: 'passport' | 'nationalId' | 'driverLicense';
    idNumber?: string;
    idImageUrl?: string;
}

// User Interface
export interface IUser {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
    address?: IAddress;
    identityVerification?: IIdentityVerification;
    role: UserRoleEnum;
    isActive: boolean;
    emailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationTokenExpiry?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    // Mongoose document methods
    toObject?(): any;
    toJSON?(): any;
}

// User Document Type (combines IUser with Mongoose Document)
export type IUserDocument = IUser & Document;

// API Response Interface
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
    statusCode?: number;
}

// Authenticated Request Interface
export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        role: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        isEmailVerified?: boolean;
        [key: string]: any;
    };
}

// JWT Payload Interface
export interface JWTPayload {
    id: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

// User Response Interface (for public API responses)
export interface IUserResponse {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    address?: IAddress;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Application related interfaces - Import from application.ts
export * from './application';

