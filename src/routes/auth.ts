// src/routes/auth.ts
import { Router } from 'express';
import AuthService from '../services/Auth.service';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', AuthService.register.bind(AuthService));
router.post('/login', AuthService.login.bind(AuthService));
router.post('/admin/login', AuthService.adminLogin.bind(AuthService));

// Email verification routes
router.post('/verify-email', AuthService.verifyEmail.bind(AuthService));
router.post('/request-email-verification', AuthService.requestEmailVerification.bind(AuthService));

// Password reset routes
router.post('/forgot-password', AuthService.forgotPassword.bind(AuthService));
router.post('/verify-reset-token', AuthService.verifyPasswordResetToken.bind(AuthService));
router.post('/reset-password', AuthService.resetPassword.bind(AuthService));

// Protected routes using the wrapper methods
router.get('/profile', authenticateUser as any, AuthService.getProfileHandler);
router.put('/profile', authenticateUser as any, AuthService.updateProfileHandler);
router.post('/change-password', authenticateUser as any, AuthService.changePasswordHandler);

// Admin setup route
router.post('/setup-admin', AuthService.setupInitialAdmin.bind(AuthService));

export default router;