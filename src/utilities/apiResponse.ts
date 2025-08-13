// src/utilities/apiResponse.ts
import { Response } from 'express';
import { IUser, ApiResponse, IUserResponse, IApplicationResponse } from '../interface';

export class ApiResponseHelper {
    /**
     * Send success response
     */
    static success<T>(
        res: Response,
        data: T,
        message: string = 'Success',
        statusCode: number = 200
    ): Response<ApiResponse<T>> {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            statusCode
        });
    }

    /**
     * Send error response
     */
    static error(
        res: Response,
        message: string = 'An error occurred',
        statusCode: number = 500,
        error?: string
    ): Response<ApiResponse<null>> {
        return res.status(statusCode).json({
            success: false,
            message,
            error,
            statusCode
        });
    }

    /**
     * Send validation error response
     */
    static validationError(
        res: Response,
        errors: any[],
        message: string = 'Validation failed'
    ): Response<ApiResponse<null>> {
        return res.status(400).json({
            success: false,
            message,
            error: errors,
            statusCode: 400
        });
    }

    /**
     * Send unauthorized response
     */
    static unauthorized(
        res: Response,
        message: string = 'Unauthorized access'
    ): Response<ApiResponse<null>> {
        return res.status(401).json({
            success: false,
            message,
            statusCode: 401
        });
    }

    /**
     * Send forbidden response
     */
    static forbidden(
        res: Response,
        message: string = 'Forbidden access'
    ): Response<ApiResponse<null>> {
        return res.status(403).json({
            success: false,
            message,
            statusCode: 403
        });
    }

    /**
     * Send not found response
     */
    static notFound(
        res: Response,
        message: string = 'Resource not found'
    ): Response<ApiResponse<null>> {
        return res.status(404).json({
            success: false,
            message,
            statusCode: 404
        });
    }
}

/**
 * Structure user data for API responses (remove sensitive fields)
 */
export const userStructure = (user: IUser | any): IUserResponse => {
    // Handle both Mongoose documents and plain objects
    let userObj: any;
    
    if (user && typeof user.toObject === 'function') {
        userObj = user.toObject();
    } else if (user && typeof user.toJSON === 'function') {
        userObj = user.toJSON();
    } else {
        userObj = user;
    }

    return {
        id: userObj._id || userObj.id,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        phone: userObj.phone,
        address: userObj.address,
        role: userObj.role,
        isActive: userObj.isActive,
        emailVerified: userObj.emailVerified,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
    };
};

/**
 * Structure application data for API responses (remove sensitive fields)
 */
export const applicationStructure = (application: any): IApplicationResponse => {
    // Handle both Mongoose documents and plain objects
    let appObj: any;
    
    if (application && typeof application.toObject === 'function') {
        appObj = application.toObject();
    } else if (application && typeof application.toJSON === 'function') {
        appObj = application.toJSON();
    } else {
        appObj = application;
    }

    return {
        id: appObj._id || appObj.id,
        applicationNumber: appObj.applicationNumber,
        applicantId: appObj.applicantId,
        applicationType: appObj.applicationType,
        title: appObj.title,
        description: appObj.description,
        academicInfo: appObj.academicInfo,
        financialInfo: appObj.financialInfo,
        guardianInfo: appObj.guardianInfo,
        schoolSupportData: appObj.schoolSupportData,
        orphanageData: appObj.orphanageData,
        supportingDocuments: appObj.supportingDocuments,
        status: appObj.status,
        priority: appObj.priority,
        submittedAt: appObj.submittedAt,
        lastUpdatedAt: appObj.lastUpdatedAt,
        currentReview: appObj.currentReview,
        assignedTo: appObj.assignedTo,
        estimatedCompletionDate: appObj.estimatedCompletionDate,
        tags: appObj.tags,
        createdAt: appObj.createdAt,
        updatedAt: appObj.updatedAt
    };
};