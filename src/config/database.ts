// config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Track connection state more reliably
let cachedConnection: typeof mongoose | null = null;

export const connect = async (Url: string) => {
    // Reuse existing connection if available
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using existing MongoDB connection');
        return cachedConnection;
    }

    try {
        // Configure for serverless
        const connectDb = await mongoose.connect(Url as string, {
            serverSelectionTimeoutMS: 5000,  // Only once - removed duplicate
            socketTimeoutMS: 45000,          // Only once - removed duplicate
            maxPoolSize: 10,                 // Maintain up to 10 socket connections
            bufferCommands: false            // Disable mongoose buffering
            // Removed bufferMaxEntries - it's not a valid mongoose option
        });
        
        cachedConnection = connectDb;
        console.log('--------MongoDB Connected-----------');
        return connectDb;
    } catch (err) {
        console.error('DB Connection Error:', err);
        cachedConnection = null; // Reset on error
        throw err;
    }
};

export const disconnect = async () => {
    if (cachedConnection) {
        await mongoose.connection.close();
        cachedConnection = null;
        console.log('MongoDB Disconnected');
    }
};

// Handle connection events (these still work in serverless)
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
    cachedConnection = null; // Reset cache on error
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
    cachedConnection = null; // Reset cache on disconnect
});