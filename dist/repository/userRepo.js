"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepo = void 0;
const baseRepo_1 = require("./baseRepo");
const User_1 = __importDefault(require("../models/User"));
class UserRepository extends baseRepo_1.BaseRepository {
    constructor() {
        super(User_1.default);
    }
    async byQuery(filter) {
        return this.findOne(filter);
    }
    async byID(id) {
        return this.findById(id);
    }
    async update(id, data) {
        return this.updateById(id, data);
    }
    async all(filter = {}, options) {
        return this.find({
            ...filter,
            isDeleted: false
        }, undefined, options);
    }
    async getActiveUsers() {
        return this.find({
            isActive: true,
            isDeleted: false
        });
    }
    async findByEmailWithPassword(email) {
        try {
            const user = await this.model.findOne({
                email: email.toLowerCase(),
                isDeleted: false
            }).select('+password').exec();
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async findByVerificationToken(email, token) {
        try {
            const user = await this.model.findOne({
                email: email.toLowerCase(),
                emailVerificationToken: token,
                emailVerificationTokenExpiry: { $gt: new Date() },
                isDeleted: false
            }).select('+emailVerificationToken +emailVerificationTokenExpiry').exec();
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async findByResetToken(email, token) {
        try {
            const user = await this.model.findOne({
                email: email.toLowerCase(),
                resetPasswordToken: token,
                resetPasswordTokenExpiry: { $gt: new Date() },
                isDeleted: false
            }).select('+resetPasswordToken +resetPasswordTokenExpiry').exec();
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async softDelete(id) {
        return this.updateById(id, {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false
        });
    }
    async restore(id) {
        return this.updateById(id, {
            isDeleted: false,
            deletedAt: undefined,
            isActive: true
        });
    }
}
exports.userRepo = new UserRepository();
exports.default = UserRepository;
//# sourceMappingURL=userRepo.js.map