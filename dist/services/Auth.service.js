"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepo_1 = require("../repository/userRepo");
const apiResponse_1 = require("../utilities/apiResponse");
const aws_ses_1 = require("../config/aws-ses");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (payload) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable is not set.");
    }
    const token = jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: '1h'
    });
    return token;
};
class AuthService {
    constructor() {
        this.getProfileHandler = (req, res) => {
            return this.getProfile(req, res);
        };
        this.updateProfileHandler = (req, res) => {
            return this.updateProfile(req, res);
        };
        this.changePasswordHandler = (req, res) => {
            return this.changePassword(req, res);
        };
    }
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, phone } = req.body;
            if (!email || !password) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email and password are required', 400);
            }
            if (password.length < 6) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Password must be at least 6 characters long', 400);
            }
            const existingUser = await userRepo_1.userRepo.byQuery({ email: email.toLowerCase() });
            if (existingUser) {
                return apiResponse_1.ApiResponseHelper.error(res, 'User with this email already exists', 400);
            }
            const hashedPassword = await bcrypt_1.default.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            const newUser = await userRepo_1.userRepo.create({
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: interface_1.UserRoleEnum.USER,
                isActive: true,
                emailVerified: false,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            await userRepo_1.userRepo.update(newUser._id, {
                emailVerificationToken: verificationCode,
                emailVerificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000)
            });
            try {
                await (0, aws_ses_1.sendAwsEmail)(email, 'Verify your email - NGO Grant System', `
                    <h2>Welcome to NGO Grant System!</h2>
                    <p>Thank you for registering. Please verify your email address using the code below:</p>
                    <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 2px;">${verificationCode}</h3>
                    <p>This code will expire in 30 minutes.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    `);
            }
            catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
            return apiResponse_1.ApiResponseHelper.success(res, { user: (0, apiResponse_1.userStructure)(newUser) }, 'User registered successfully. Please check your email for verification code.', 201);
        }
        catch (error) {
            console.error('Registration error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error registering user: ' + error, 500);
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email and password are required', 400);
            }
            const user = await userRepo_1.userRepo.findByEmailWithPassword(email.toLowerCase());
            if (!user) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Invalid email or password', 401);
            }
            if (!user.isActive) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Account is deactivated. Please contact support.', 403);
            }
            const validPassword = await bcrypt_1.default.compare(password, user.password);
            if (!validPassword) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Invalid email or password', 401);
            }
            const payload = {
                id: user._id,
                role: user.role,
                email: user.email,
            };
            const token = generateToken(payload);
            return apiResponse_1.ApiResponseHelper.success(res, {
                user: (0, apiResponse_1.userStructure)(user),
                token
            }, 'User logged in successfully');
        }
        catch (error) {
            console.error('Login error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error logging in: ' + error, 500);
        }
    }
    async adminLogin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email and password are required', 400);
            }
            const user = await userRepo_1.userRepo.findByEmailWithPassword(email.toLowerCase());
            if (!user || user.role !== interface_1.UserRoleEnum.ADMIN) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Invalid admin credentials', 401);
            }
            if (!user.isActive) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Admin account is deactivated', 403);
            }
            const validPassword = await bcrypt_1.default.compare(password, user.password);
            if (!validPassword) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Invalid admin credentials', 401);
            }
            const payload = {
                id: user._id,
                role: user.role,
                email: user.email,
            };
            const token = generateToken(payload);
            return apiResponse_1.ApiResponseHelper.success(res, {
                user: (0, apiResponse_1.userStructure)(user),
                token
            }, 'Admin logged in successfully');
        }
        catch (error) {
            console.error('Admin login error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error logging in admin: ' + error, 500);
        }
    }
    async verifyEmail(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email and OTP are required', 400);
            }
            const user = await userRepo_1.userRepo.findByVerificationToken(email.toLowerCase(), otp);
            if (!user) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Invalid or expired verification code', 400);
            }
            if (user.emailVerified) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email already verified', 400);
            }
            await userRepo_1.userRepo.update(user._id, {
                emailVerified: true,
                emailVerificationToken: undefined,
                emailVerificationTokenExpiry: undefined
            });
            return apiResponse_1.ApiResponseHelper.success(res, null, 'Email verified successfully');
        }
        catch (error) {
            console.error('Email verification error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error verifying email: ' + error, 500);
        }
    }
    async requestEmailVerification(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email is required', 400);
            }
            const user = await userRepo_1.userRepo.byQuery({ email: email.toLowerCase() });
            if (!user) {
                return apiResponse_1.ApiResponseHelper.error(res, 'User not found', 404);
            }
            if (user.emailVerified) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email already verified', 400);
            }
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            await userRepo_1.userRepo.update(user._id, {
                emailVerificationToken: verificationCode,
                emailVerificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000)
            });
            await (0, aws_ses_1.sendAwsEmail)(email, 'Email Verification Code - NGO Grant System', `
                <h2>Email Verification</h2>
                <p>Your email verification code is:</p>
                <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 2px;">${verificationCode}</h3>
                <p>This code will expire in 30 minutes.</p>
                `);
            return apiResponse_1.ApiResponseHelper.success(res, null, 'Verification code sent to your email');
        }
        catch (error) {
            console.error('Request email verification error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error requesting email verification: ' + error, 500);
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email is required', 400);
            }
            const user = await userRepo_1.userRepo.byQuery({ email: email.toLowerCase() });
            if (!user) {
                return apiResponse_1.ApiResponseHelper.error(res, 'User not found', 404);
            }
            const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
            await userRepo_1.userRepo.update(user._id, {
                resetPasswordToken: resetToken,
                resetPasswordTokenExpiry: new Date(Date.now() + 30 * 60 * 1000)
            });
            await (0, aws_ses_1.sendAwsEmail)(email, 'Password Reset - NGO Grant System', `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Use the code below to reset your password:</p>
                <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 2px;">${resetToken}</h3>
                <p>This code will expire in 30 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                `);
            return apiResponse_1.ApiResponseHelper.success(res, null, 'Password reset code sent to your email');
        }
        catch (error) {
            console.error('Forgot password error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error sending password reset code: ' + error, 500);
        }
    }
    async verifyPasswordResetToken(req, res) {
        try {
            const { email, token } = req.body;
            if (!email || !token) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email and token are required', 400);
            }
            const user = await userRepo_1.userRepo.findByResetToken(email.toLowerCase(), token);
            if (!user) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Invalid or expired reset token', 400);
            }
            return apiResponse_1.ApiResponseHelper.success(res, null, 'Token verified successfully');
        }
        catch (error) {
            console.error('Verify reset token error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error verifying token: ' + error, 500);
        }
    }
    async resetPassword(req, res) {
        try {
            const { email, token, newPassword } = req.body;
            if (!email || !token || !newPassword) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email, token, and new password are required', 400);
            }
            if (newPassword.length < 6) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Password must be at least 6 characters long', 400);
            }
            const user = await userRepo_1.userRepo.findByResetToken(email.toLowerCase(), token);
            if (!user) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Invalid or expired reset token', 400);
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            await userRepo_1.userRepo.update(user._id, {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordTokenExpiry: undefined
            });
            return apiResponse_1.ApiResponseHelper.success(res, null, 'Password reset successful');
        }
        catch (error) {
            console.error('Reset password error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error resetting password: ' + error, 500);
        }
    }
    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Old password and new password are required', 400);
            }
            if (newPassword.length < 6) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Password must be at least 6 characters long', 400);
            }
            const user = await userRepo_1.userRepo.findByEmailWithPassword(req.user.email);
            if (!user) {
                return apiResponse_1.ApiResponseHelper.error(res, 'User not found', 404);
            }
            const validPassword = await bcrypt_1.default.compare(oldPassword, user.password);
            if (!validPassword) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Invalid old password', 400);
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            await userRepo_1.userRepo.update(req.user.id, {
                password: hashedPassword,
                updatedAt: new Date()
            });
            return apiResponse_1.ApiResponseHelper.success(res, null, 'Password changed successfully');
        }
        catch (error) {
            console.error('Change password error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error changing password: ' + error, 500);
        }
    }
    async setupInitialAdmin(req, res) {
        try {
            const existingAdmin = await userRepo_1.userRepo.byQuery({ role: interface_1.UserRoleEnum.ADMIN });
            if (existingAdmin) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Admin user already exists', 400);
            }
            const { email, password, firstName, lastName } = req.body;
            if (!email || !password) {
                return apiResponse_1.ApiResponseHelper.error(res, 'Email and password are required', 400);
            }
            const hashedPassword = await bcrypt_1.default.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            const admin = await userRepo_1.userRepo.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: interface_1.UserRoleEnum.ADMIN,
                isActive: true,
                emailVerified: true
            });
            return apiResponse_1.ApiResponseHelper.success(res, { user: (0, apiResponse_1.userStructure)(admin) }, 'Initial admin user created successfully', 201);
        }
        catch (error) {
            console.error('Setup admin error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error creating initial admin user: ' + error, 500);
        }
    }
    async getProfile(req, res) {
        try {
            const user = await userRepo_1.userRepo.byID(req.user.id);
            if (!user) {
                return apiResponse_1.ApiResponseHelper.error(res, 'User not found', 404);
            }
            return apiResponse_1.ApiResponseHelper.success(res, { user: (0, apiResponse_1.userStructure)(user) }, 'Profile retrieved successfully');
        }
        catch (error) {
            console.error('Get profile error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error retrieving profile: ' + error, 500);
        }
    }
    async updateProfile(req, res) {
        try {
            const { firstName, lastName, phone, address } = req.body;
            const updatedUser = await userRepo_1.userRepo.update(req.user.id, {
                firstName,
                lastName,
                phone,
                address,
                updatedAt: new Date()
            });
            return apiResponse_1.ApiResponseHelper.success(res, { user: (0, apiResponse_1.userStructure)(updatedUser) }, 'Profile updated successfully');
        }
        catch (error) {
            console.error('Update profile error:', error);
            return apiResponse_1.ApiResponseHelper.error(res, 'Error updating profile: ' + error, 500);
        }
    }
}
exports.default = new AuthService();
//# sourceMappingURL=Auth.service.js.map