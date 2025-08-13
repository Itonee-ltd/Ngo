// src/models/User.ts
import mongoose, { Schema, Model } from "mongoose";
import { IUserDocument, UserRoleEnum, IAddress, IIdentityVerification } from "../interface";

const addressSchema = new Schema<IAddress>({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
}, { _id: false });

const identityVerificationSchema = new Schema<IIdentityVerification>({
    idType: {
        type: String,
        enum: ['passport', 'nationalId', 'driverLicense']
    },
    idNumber: { type: String },
    idImageUrl: { type: String }
}, { _id: false });

// Define interface for instance methods (if you have any custom methods)
interface IUserMethods {
    // Add any custom instance methods here if needed
}

// Define interface for static methods (if you have any custom statics)
interface IUserStatics {
    // Add any custom static methods here if needed
}

// Combine document with methods
type UserDocument = IUserDocument & IUserMethods;
type UserModel = Model<UserDocument> & IUserStatics;

const userSchema = new Schema<UserDocument, UserModel>({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    address: { type: addressSchema },
    identityVerification: { type: identityVerificationSchema },
    role: {
        type: String,
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.USER
    },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationTokenExpiry: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordTokenExpiry: { type: Date, select: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ role: 1 });

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = new Date();
    }
    next();
});

// Update the updatedAt field before updating
userSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

// Don't return password and sensitive fields by default
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.emailVerificationToken;
    delete userObject.resetPasswordToken;
    delete userObject.emailVerificationTokenExpiry;
    delete userObject.resetPasswordTokenExpiry;
    return userObject;
};

const UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);
export default UserModel;