
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connect = async (Url: string) => {
    try {
        const connectDb = await mongoose.connect(Url as string, {
            serverSelectionTimeoutMS: 5000,
        });
        
        isConnected = true;
        console.log('--------MongoDB Connected-----------');
        return connectDb;
    } catch (err) {
        console.error('DB Connection Error:', err);
        throw err;
    }
};

export const disconnect = () => {
    if (isConnected) {
        mongoose.connection.close();
        isConnected = false;
        console.log('MongoDB Disconnected');
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});