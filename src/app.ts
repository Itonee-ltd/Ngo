// app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import { database } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import routes from "./routes"; // Import the main router

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', true);

// Debug Environment Variables
console.log('🔍 Debug Environment Variables:', {
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI ? 'Connected' : 'Missing'
});

// Connect to the database
database.connect(process.env.MONGO_URI as string);

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration - Must be BEFORE routes
app.use(cors({
    origin: (origin, callback) => {
        console.log('🌐 CORS Origin Check:', { 
            requestOrigin: origin, 
            allowedOrigin: process.env.CORS_ORIGIN,
            method: 'Dynamic Check'
        });
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Allow all origins for development/testing
        const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // For debugging - allow all for now
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
    console.log('🚀 Preflight request for:', req.url);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per 15 minutes per IP
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Body Parsing Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route to verify CORS
app.get('/api/v1/test-cors', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json({ 
        success: true,
        message: 'CORS test successful',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        corsOrigin: process.env.CORS_ORIGIN,
        requestOrigin: req.get('origin')
    });
});

// Debug route to check all routes
app.get('/api/v1/debug/routes', (req, res) => {
    console.log('📋 Available routes debug requested');
    res.json({
        success: true,
        message: 'Routes debug endpoint',
        environment: process.env.NODE_ENV,
        availableRoutes: [
            'GET /api/v1/test-cors',
            'GET /api/v1/debug/routes',
            'Your other routes should appear here'
        ]
    });
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url} - Origin: ${req.get('origin') || 'none'}`);
    next();
});

// Main Routes
app.use("/api/v1", routes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "NGO Grant Management System API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Error Handlers
app.use(notFoundHandler); // Handle 404 Not Found
app.use(errorHandler); // Global Error Handler

// Start the server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
    console.error(`Logged Error: ${err.name} - ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});

export default app;

// Deployment test
console.log('Deployment test - v1.2');