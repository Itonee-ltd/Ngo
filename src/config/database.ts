// config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Track connection state more reliably
let cachedConnection: typeof mongoose | null = null;
let isConnecting = false; // Prevent multiple simultaneous connections

export const connect = async (Url: string): Promise<typeof mongoose> => {
    // Return existing connection if available
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using existing MongoDB connection');
        return cachedConnection;
    }

    // If already connecting, wait for it to complete
    if (isConnecting) {
        console.log('Connection in progress, waiting...');
        // Wait for connection to complete
        while (isConnecting && mongoose.connection.readyState === 2) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (mongoose.connection.readyState === 1) {
            return mongoose;
        }
    }

    try {
        isConnecting = true;
        console.log('Establishing new MongoDB connection...');
        
        // Configure for serverless with proper error handling
        const connectDb = await mongoose.connect(Url as string, {
            serverSelectionTimeoutMS: 10000, // Increased timeout
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            bufferCommands: false,
            // Add these for better serverless compatibility
            maxIdleTimeMS: 30000,
            heartbeatFrequencyMS: 10000,
        });

        cachedConnection = connectDb;
        isConnecting = false;
        console.log('--------MongoDB Connected-----------');
        console.log('Connection state:', mongoose.connection.readyState);
        
        return connectDb;
    } catch (err) {
        console.error('DB Connection Error:', err);
        cachedConnection = null;
        isConnecting = false;
        throw err;
    }
};

export const disconnect = async () => {
    if (cachedConnection) {
        await mongoose.connection.close();
        cachedConnection = null;
        isConnecting = false;
        console.log('MongoDB Disconnected');
    }
};

// Utility function to ensure connection before operations
export const ensureConnection = async (mongoUrl: string): Promise<void> => {
    if (mongoose.connection.readyState !== 1) {
        await connect(mongoUrl);
        // Double-check connection is ready
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Failed to establish database connection');
        }
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
    cachedConnection = null;
    isConnecting = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
    cachedConnection = null;
    isConnecting = false;
});