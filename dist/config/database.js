"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let isConnected = false;
const connect = async (Url) => {
    try {
        const connectDb = await mongoose_1.default.connect(Url, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log('--------MongoDB Connected-----------');
        return connectDb;
    }
    catch (err) {
        console.error('DB Connection Error:', err);
        throw err;
    }
};
exports.connect = connect;
const disconnect = () => {
    if (isConnected) {
        mongoose_1.default.connection.close();
        isConnected = false;
        console.log('MongoDB Disconnected');
    }
};
exports.disconnect = disconnect;
mongoose_1.default.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});
//# sourceMappingURL=database.js.map