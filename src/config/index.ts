// config/index.ts
import { connect, disconnect, ensureConnection } from './database';

export const database = {
    connect,
    disconnect,
    ensureConnection,
};