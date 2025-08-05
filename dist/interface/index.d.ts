import { Request } from 'express';
import { Document } from 'mongoose';
export declare enum UserRoleEnum {
    USER = "user",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}
export interface IIdentityVerification {
    idType?: 'passport' | 'nationalId' | 'driverLicense';
    idNumber?: string;
    idImageUrl?: string;
}
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
    toObject?(): any;
    toJSON?(): any;
}
export type IUserDocument = IUser & Document;
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
    statusCode?: number;
}
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
export interface JWTPayload {
    id: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
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
//# sourceMappingURL=index.d.ts.map