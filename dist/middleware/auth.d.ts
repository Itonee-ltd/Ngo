import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../interface';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        role: string;
        [key: string]: any;
    };
}
export declare const authenticateUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<ApiResponse<any>> | void;
export declare const requireRole: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<ApiResponse<any>> | void;
export {};
//# sourceMappingURL=auth.d.ts.map