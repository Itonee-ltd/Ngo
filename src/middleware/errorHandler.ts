
import { Request, Response, NextFunction } from 'express';
import { ApiResponseHelper } from '../utilities/apiResponse';

export interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: any;
    path?: string;
    value?: any;
}

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error Stack:', err.stack);

    // Duplicate key error (MongoDB)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return ApiResponseHelper.error(
            res,
            `${field} already exists`,
            400
        );
    }

    // Validation error
    if (err.name === 'ValidationError') {
        return ApiResponseHelper.error(
            res,
            'Validation Error',
            400,
            err.message
        );
    }

    // Cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return ApiResponseHelper.error(
            res,
            'Invalid ID format',
            400
        );
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ApiResponseHelper.unauthorized(res, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        return ApiResponseHelper.unauthorized(res, 'Token expired');
    }

    // Default error
    return ApiResponseHelper.error(
        res,
        err.message || 'Internal server error',
        err.statusCode || 500
    );
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
    return ApiResponseHelper.notFound(
        res,
        `Route ${req.originalUrl} not found`
    );
};

/**
 * Async Error Handler Wrapper
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};