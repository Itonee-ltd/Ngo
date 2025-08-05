import { Response } from 'express';
import { IUser, ApiResponse, IUserResponse } from '../interface';
export declare class ApiResponseHelper {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number): Response<ApiResponse<T>>;
    static error(res: Response, message?: string, statusCode?: number, error?: string): Response<ApiResponse<null>>;
    static validationError(res: Response, errors: any[], message?: string): Response<ApiResponse<null>>;
    static unauthorized(res: Response, message?: string): Response<ApiResponse<null>>;
    static forbidden(res: Response, message?: string): Response<ApiResponse<null>>;
    static notFound(res: Response, message?: string): Response<ApiResponse<null>>;
}
export declare const userStructure: (user: IUser | any) => IUserResponse;
//# sourceMappingURL=apiResponse.d.ts.map