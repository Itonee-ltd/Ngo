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
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0 // Disable mongoose buffering
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

// Remove SIGINT handler for serverless - Vercel handles this
// Serverless functions don't need graceful shutdown handling