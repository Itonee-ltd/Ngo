import { Request, Response, NextFunction } from 'express';
export interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: any;
    path?: string;
    value?: any;
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => Response<import("../interface").ApiResponse<null>, Record<string, any>>;
export declare const notFoundHandler: (req: Request, res: Response) => Response<import("../interface").ApiResponse<null>, Record<string, any>>;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map