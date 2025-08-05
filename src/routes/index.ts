
import express from 'express';
import authRoutes from './auth';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NGO Grant Management API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Mount route modules
router.use('/auth', authRoutes);

export default router;