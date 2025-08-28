// src/app.ts - Updated Express configuration
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { database } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Trust proxy for rate limiting (fix the ValidationError)
app.set('trust proxy', 1); // Trust first proxy

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting with proper configuration
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    // Fix the trust proxy issue by providing a proper key generator
    keyGenerator: (req) => {
        // Use the real IP from behind proxy
        return req.ip || req.connection.remoteAddress || 'unknown';
    }
});

app.use('/api', limiter);

// Routes
app.use('/api/v1', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database connection on startup
const initializeApp = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (mongoUri) {
            await database.connect(mongoUri);
            console.log('✅ Database connection initialized');
        } else {
            console.warn('⚠️ No MongoDB URI provided');
        }
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    initializeApp().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN}`);
        });
    });
}

export default app;