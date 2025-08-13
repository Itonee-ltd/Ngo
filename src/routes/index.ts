// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth';
import applicationRoutes from './application';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NGO Grant Management System API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);

export default router;