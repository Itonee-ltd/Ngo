// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../interface';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        role: string;
        [key: string]: any;
    };
}

export const authenticateUser = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Response<ApiResponse<any>> | void => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
                data: null
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
                data: null
            });
        }

        const decoded = jwt.verify(token, jwtSecret) as any;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            data: null
        });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): Response<ApiResponse<any>> | void => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                    data: null
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions',
                    data: null
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Authorization error',
                data: null
            });
        }
    };
};