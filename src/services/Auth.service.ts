import { Request, Response } from 'express';
import { IUser, AuthenticatedRequest, UserRoleEnum } from '../interface';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepo } from '../repository/userRepo';
import { ApiResponseHelper, userStructure } from '../utilities/apiResponse';
import { sendAwsEmail } from '../config/aws-ses';
import { database } from '../config'; // Import database helper
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    id: string;
    role: string;
    email: string;
}

const generateToken = (payload: JwtPayload): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable is not set.");
    }

    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: '1h'
    });

    return token;
};

class AuthService {
    /**
     * Ensure database connection before operations
     */
    private async ensureDbConnection() {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI or MONGO_URI environment variable is not set');
        }
        await database.ensureConnection(mongoUri);
    }

    /**
     * User Registration
     */
    async register(req: Request, res: Response) {
        try {
            // CRITICAL: Ensure database connection first
            await this.ensureDbConnection();

            const { email, password, firstName, lastName, phone } = req.body;

            // Validation
            if (!email || !password) {
                return ApiResponseHelper.error(res, 'Email and password are required', 400);
            }

            if (password.length < 6) {
                return ApiResponseHelper.error(res, 'Password must be at least 6 characters long', 400);
            }

            // Check if user already exists
            const existingUser = await userRepo.byQuery({ email: email.toLowerCase() });
            if (existingUser) {
                return ApiResponseHelper.error(res, 'User with this email already exists', 400);
            }

            // Hash password
            const hashedPassword = await bcryptjs.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));

            // Create user
            const newUser = await userRepo.create({
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: UserRoleEnum.USER,
                isActive: true,
                emailVerified: false,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Generate email verification token
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Update user with verification token
            await userRepo.update(newUser._id as string, {
                emailVerificationToken: verificationCode,
                emailVerificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
            });

            // Send verification email
            try {
                await sendAwsEmail(
                    email,
                    'Verify your email - NGO Grant System',
                    `
                    <h2>Welcome to NGO Grant System!</h2>
                    <p>Thank you for registering. Please verify your email address using the code below:</p>
                    <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 2px;">${verificationCode}</h3>
                    <p>This code will expire in 30 minutes.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    `
                );
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't fail registration if email fails
            }

            return ApiResponseHelper.success(
                res,
                { user: userStructure(newUser) },
                'User registered successfully. Please check your email for verification code.',
                201
            );
        } catch (error) {
            console.error('Registration error:', error);
            return ApiResponseHelper.error(res, 'Error registering user: ' + error, 500);
        }
    }

    /**
     * User Login
     */
    async login(req: Request, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { email, password } = req.body;

            if (!email || !password) {
                return ApiResponseHelper.error(res, 'Email and password are required', 400);
            }

            // Find user with password
            const user = await userRepo.findByEmailWithPassword(email.toLowerCase());
            if (!user) {
                return ApiResponseHelper.error(res, 'Invalid email or password', 401);
            }

            // Check if user is active
            if (!user.isActive) {
                return ApiResponseHelper.error(res, 'Account is deactivated. Please contact support.', 403);
            }

            // Verify password
            const validPassword = await bcryptjs.compare(password, user.password);
            if (!validPassword) {
                return ApiResponseHelper.error(res, 'Invalid email or password', 401);
            }

            // Generate JWT token using the helper function
            const payload = {
                id: user._id as string,
                role: user.role,
                email: user.email,
            };
            const token = generateToken(payload);

            return ApiResponseHelper.success(
                res,
                { 
                    user: userStructure(user), 
                    token 
                },
                'User logged in successfully'
            );
        } catch (error) {
            console.error('Login error:', error);
            return ApiResponseHelper.error(res, 'Error logging in: ' + error, 500);
        }
    }

    /**
     * Admin Login
     */
    async adminLogin(req: Request, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { email, password } = req.body;

            if (!email || !password) {
                return ApiResponseHelper.error(res, 'Email and password are required', 400);
            }

            // Find admin user with password
            const user = await userRepo.findByEmailWithPassword(email.toLowerCase());

            if (!user || user.role !== UserRoleEnum.ADMIN) {
                return ApiResponseHelper.error(res, 'Invalid admin credentials', 401);
            }

            // Check if admin is active
            if (!user.isActive) {
                return ApiResponseHelper.error(res, 'Admin account is deactivated', 403);
            }

            // Verify password
            const validPassword = await bcryptjs.compare(password, user.password);
            if (!validPassword) {
                return ApiResponseHelper.error(res, 'Invalid admin credentials', 401);
            }

            // Generate JWT token using the helper function
            const payload = {
               id: user._id as string,
               role: user.role,
               email: user.email,
            };
            const token = generateToken(payload);

            return ApiResponseHelper.success(
                res,
                { 
                    user: userStructure(user), 
                    token 
                },
                'Admin logged in successfully'
            );
        } catch (error) {
            console.error('Admin login error:', error);
            return ApiResponseHelper.error(res, 'Error logging in admin: ' + error, 500);
        }
    }

    /**
     * Verify Email
     */
    async verifyEmail(req: Request, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { email, otp } = req.body;

            if (!email || !otp) {
                return ApiResponseHelper.error(res, 'Email and OTP are required', 400);
            }

            // Find user with valid token
            const user = await userRepo.findByVerificationToken(email.toLowerCase(), otp);

            if (!user) {
                return ApiResponseHelper.error(res, 'Invalid or expired verification code', 400);
            }

            if (user.emailVerified) {
                return ApiResponseHelper.error(res, 'Email already verified', 400);
            }

            // Update user as verified
            await userRepo.update(user._id as string, {
                emailVerified: true,
                emailVerificationToken: undefined,
                emailVerificationTokenExpiry: undefined
            });

            return ApiResponseHelper.success(res, null, 'Email verified successfully');
        } catch (error) {
            console.error('Email verification error:', error);
            return ApiResponseHelper.error(res, 'Error verifying email: ' + error, 500);
        }
    }

    /**
     * Request Email Verification
     */
    async requestEmailVerification(req: Request, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { email } = req.body;

            if (!email) {
                return ApiResponseHelper.error(res, 'Email is required', 400);
            }

            const user = await userRepo.byQuery({ email: email.toLowerCase() });
            if (!user) {
                return ApiResponseHelper.error(res, 'User not found', 404);
            }

            if (user.emailVerified) {
                return ApiResponseHelper.error(res, 'Email already verified', 400);
            }

            // Generate new verification code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Update user with new token
            await userRepo.update(user._id as string, {
                emailVerificationToken: verificationCode,
                emailVerificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
            });

            // Send verification email
            await sendAwsEmail(
                email,
                'Email Verification Code - NGO Grant System',
                `
                <h2>Email Verification</h2>
                <p>Your email verification code is:</p>
                <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 2px;">${verificationCode}</h3>
                <p>This code will expire in 30 minutes.</p>
                `
            );

            return ApiResponseHelper.success(res, null, 'Verification code sent to your email');
        } catch (error) {
            console.error('Request email verification error:', error);
            return ApiResponseHelper.error(res, 'Error requesting email verification: ' + error, 500);
        }
    }

    /**
     * Forgot Password
     */
    async forgotPassword(req: Request, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { email } = req.body;

            if (!email) {
                return ApiResponseHelper.error(res, 'Email is required', 400);
            }

            const user = await userRepo.byQuery({ email: email.toLowerCase() });
            if (!user) {
                return ApiResponseHelper.error(res, 'User not found', 404);
            }

            // Generate reset token
            const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

            // Update user with reset token
            await userRepo.update(user._id as string, {
                resetPasswordToken: resetToken,
                resetPasswordTokenExpiry: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
            });

            // Send reset email
            await sendAwsEmail(
                email,
                'Password Reset - NGO Grant System',
                `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Use the code below to reset your password:</p>
                <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 2px;">${resetToken}</h3>
                <p>This code will expire in 30 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                `
            );

            return ApiResponseHelper.success(res, null, 'Password reset code sent to your email');
        } catch (error) {
            console.error('Forgot password error:', error);
            return ApiResponseHelper.error(res, 'Error sending password reset code: ' + error, 500);
        }
    }

    /**
     * Verify Password Reset Token
     */
    async verifyPasswordResetToken(req: Request, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { email, token } = req.body;

            if (!email || !token) {
                return ApiResponseHelper.error(res, 'Email and token are required', 400);
            }

            const user = await userRepo.findByResetToken(email.toLowerCase(), token);

            if (!user) {
                return ApiResponseHelper.error(res, 'Invalid or expired reset token', 400);
            }

            return ApiResponseHelper.success(res, null, 'Token verified successfully');
        } catch (error) {
            console.error('Verify reset token error:', error);
            return ApiResponseHelper.error(res, 'Error verifying token: ' + error, 500);
        }
    }

    /**
     * Reset Password
     */
    async resetPassword(req: Request, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { email, token, newPassword } = req.body;

            if (!email || !token || !newPassword) {
                return ApiResponseHelper.error(res, 'Email, token, and new password are required', 400);
            }

            if (newPassword.length < 6) {
                return ApiResponseHelper.error(res, 'Password must be at least 6 characters long', 400);
            }

            const user = await userRepo.findByResetToken(email.toLowerCase(), token);

            if (!user) {
                return ApiResponseHelper.error(res, 'Invalid or expired reset token', 400);
            }

            // Hash new password
            const hashedPassword = await bcryptjs.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));

            // Update user password and clear reset token
            await userRepo.update(user._id as string, {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordTokenExpiry: undefined
            });

            return ApiResponseHelper.success(res, null, 'Password reset successful');
        } catch (error) {
            console.error('Reset password error:', error);
            return ApiResponseHelper.error(res, 'Error resetting password: ' + error, 500);
        }
    }

    /**
     * Change Password (for authenticated users)
     */
    async changePassword(req: AuthenticatedRequest, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return ApiResponseHelper.error(res, 'Old password and new password are required', 400);
            }

            if (newPassword.length < 6) {
                return ApiResponseHelper.error(res, 'Password must be at least 6 characters long', 400);
            }

            // Get user with password
            const user = await userRepo.findByEmailWithPassword(req.user.email);
            if (!user) {
                return ApiResponseHelper.error(res, 'User not found', 404);
            }

            // Verify old password
            const validPassword = await bcryptjs.compare(oldPassword, user.password);
            if (!validPassword) {
                return ApiResponseHelper.error(res, 'Invalid old password', 400);
            }

            // Hash new password
            const hashedPassword = await bcryptjs.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));

            // Update password
            await userRepo.update(req.user.id, { 
                password: hashedPassword,
                updatedAt: new Date()
            });

            return ApiResponseHelper.success(res, null, 'Password changed successfully');
        } catch (error) {
            console.error('Change password error:', error);
            return ApiResponseHelper.error(res, 'Error changing password: ' + error, 500);
        }
    }

    /**
     * Setup Initial Admin (for system initialization)
     */
    async setupInitialAdmin(req: Request, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            // Check if any admin users exist
            const existingAdmin = await userRepo.byQuery({ role: UserRoleEnum.ADMIN });

            if (existingAdmin) {
                return ApiResponseHelper.error(res, 'Admin user already exists', 400);
            }

            const { email, password, firstName, lastName } = req.body;

            if (!email || !password) {
                return ApiResponseHelper.error(res, 'Email and password are required', 400);
            }

            // Hash password
            const hashedPassword = await bcryptjs.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));

            // Create the first admin user
            const admin = await userRepo.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: UserRoleEnum.ADMIN,
                isActive: true,
                emailVerified: true // Auto-verify admin
            }) as IUser;

            return ApiResponseHelper.success(
                res,
                { user: userStructure(admin) },
                'Initial admin user created successfully',
                201
            );
        } catch (error) {
            console.error('Setup admin error:', error);
            return ApiResponseHelper.error(res, 'Error creating initial admin user: ' + error, 500);
        }
    }

    /**
     * Get Current User Profile
     */
    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const user = await userRepo.byID(req.user.id);
            if (!user) {
                return ApiResponseHelper.error(res, 'User not found', 404);
            }

            return ApiResponseHelper.success(
                res,
                { user: userStructure(user) },
                'Profile retrieved successfully'
            );
        } catch (error) {
            console.error('Get profile error:', error);
            return ApiResponseHelper.error(res, 'Error retrieving profile: ' + error, 500);
        }
    }

    /**
     * Update User Profile
     */
    async updateProfile(req: AuthenticatedRequest, res: Response) {
        try {
            // Ensure database connection
            await this.ensureDbConnection();

            const { firstName, lastName, phone, address } = req.body;

            const updatedUser = await userRepo.update(req.user.id, {
                firstName,
                lastName,
                phone,
                address,
                updatedAt: new Date()
            }) as IUser;

            return ApiResponseHelper.success(
                res,
                { user: userStructure(updatedUser) },
                'Profile updated successfully'
            );
        } catch (error) {
            console.error('Update profile error:', error);
            return ApiResponseHelper.error(res, 'Error updating profile: ' + error, 500);
        }
    }

    // Express-compatible wrapper methods for protected routes
    /**
     * Express-compatible wrapper for getProfile
     */
    getProfileHandler = (req: Request, res: Response) => {
        return this.getProfile(req as AuthenticatedRequest, res);
    };

    /**
     * Express-compatible wrapper for updateProfile
     */
    updateProfileHandler = (req: Request, res: Response) => {
        return this.updateProfile(req as AuthenticatedRequest, res);
    };

    /**
     * Express-compatible wrapper for changePassword
     */
    changePasswordHandler = (req: Request, res: Response) => {
        return this.changePassword(req as AuthenticatedRequest, res);
    };
}

export default new AuthService();