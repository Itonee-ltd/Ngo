import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interface';
declare class AuthService {
    register(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>> | Response<import("../interface").ApiResponse<{
        user: import("../interface").IUserResponse;
    }>, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>> | Response<import("../interface").ApiResponse<{
        user: import("../interface").IUserResponse;
        token: string;
    }>, Record<string, any>>>;
    adminLogin(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>> | Response<import("../interface").ApiResponse<{
        user: import("../interface").IUserResponse;
        token: string;
    }>, Record<string, any>>>;
    verifyEmail(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>>>;
    requestEmailVerification(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>>>;
    forgotPassword(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>>>;
    verifyPasswordResetToken(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>>>;
    resetPassword(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>>>;
    changePassword(req: AuthenticatedRequest, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>>>;
    setupInitialAdmin(req: Request, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>> | Response<import("../interface").ApiResponse<{
        user: import("../interface").IUserResponse;
    }>, Record<string, any>>>;
    getProfile(req: AuthenticatedRequest, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>> | Response<import("../interface").ApiResponse<{
        user: import("../interface").IUserResponse;
    }>, Record<string, any>>>;
    updateProfile(req: AuthenticatedRequest, res: Response): Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>> | Response<import("../interface").ApiResponse<{
        user: import("../interface").IUserResponse;
    }>, Record<string, any>>>;
    getProfileHandler: (req: Request, res: Response) => Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>> | Response<import("../interface").ApiResponse<{
        user: import("../interface").IUserResponse;
    }>, Record<string, any>>>;
    updateProfileHandler: (req: Request, res: Response) => Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>> | Response<import("../interface").ApiResponse<{
        user: import("../interface").IUserResponse;
    }>, Record<string, any>>>;
    changePasswordHandler: (req: Request, res: Response) => Promise<Response<import("../interface").ApiResponse<null>, Record<string, any>>>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=Auth.service.d.ts.map