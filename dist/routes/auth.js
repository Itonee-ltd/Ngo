"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_service_1 = __importDefault(require("../services/Auth.service"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', Auth_service_1.default.register.bind(Auth_service_1.default));
router.post('/login', Auth_service_1.default.login.bind(Auth_service_1.default));
router.post('/admin/login', Auth_service_1.default.adminLogin.bind(Auth_service_1.default));
router.post('/verify-email', Auth_service_1.default.verifyEmail.bind(Auth_service_1.default));
router.post('/request-email-verification', Auth_service_1.default.requestEmailVerification.bind(Auth_service_1.default));
router.post('/forgot-password', Auth_service_1.default.forgotPassword.bind(Auth_service_1.default));
router.post('/verify-reset-token', Auth_service_1.default.verifyPasswordResetToken.bind(Auth_service_1.default));
router.post('/reset-password', Auth_service_1.default.resetPassword.bind(Auth_service_1.default));
router.get('/profile', auth_1.authenticateUser, Auth_service_1.default.getProfileHandler);
router.put('/profile', auth_1.authenticateUser, Auth_service_1.default.updateProfileHandler);
router.post('/change-password', auth_1.authenticateUser, Auth_service_1.default.changePasswordHandler);
router.post('/setup-admin', Auth_service_1.default.setupInitialAdmin.bind(Auth_service_1.default));
exports.default = router;
//# sourceMappingURL=auth.js.map