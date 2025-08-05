
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

// Connect to the database
database.connect(process.env.MONGO_URI as string);

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Main Routes
app.use("/api/v1", routes);

// Error Handlers
app.use(notFoundHandler); // Handle 404 Not Found
app.use(errorHandler); // Global Error Handler

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
    console.error(`Logged Error: ${err.name} - ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});

export default app;