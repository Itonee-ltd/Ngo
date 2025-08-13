// src/models/Application.ts
import mongoose, { Schema, Model, Document } from "mongoose";
import { 
    IApplicationDocument, 
    ApplicationTypeEnum, 
    ApplicationStatusEnum, 
    PriorityLevelEnum,
    IAcademicInfo,
    IFinancialInfo,
    ISupportingDocument,
    IGuardianInfo,
    ISchoolSupportData,
    IOrphanageData,
    IApplicationReview
} from "../interface";

// Academic Info Schema
const academicInfoSchema = new Schema<IAcademicInfo>({
    schoolName: { type: String, required: true, trim: true },
    schoolAddress: { type: String, required: true, trim: true },
    studentClass: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true, trim: true },
    principalName: { type: String, trim: true },
    schoolPhoneNumber: { type: String, trim: true },
    schoolEmail: { type: String, trim: true, lowercase: true }
}, { _id: false });

// Financial Info Schema
const financialBreakdownSchema = new Schema({
    item: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true }
}, { _id: false });

const financialInfoSchema = new Schema<IFinancialInfo>({
    requestedAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'NGN', trim: true },
    breakdown: [financialBreakdownSchema],
    totalFamilyIncome: { type: Number, min: 0 },
    numberOfDependents: { type: Number, min: 0 }
}, { _id: false });

// Supporting Document Schema
const supportingDocumentSchema = new Schema<ISupportingDocument>({
    documentType: { type: String, required: true, trim: true },
    documentUrl: { type: String, required: true, trim: true },
    documentName: { type: String, required: true, trim: true },
    uploadedAt: { type: Date, required: true, default: Date.now }
}, { _id: false });

// Guardian Info Schema
const guardianInfoSchema = new Schema<IGuardianInfo>({
    guardianName: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    guardianPhone: { type: String, required: true, trim: true },
    guardianEmail: { type: String, trim: true, lowercase: true },
    guardianAddress: { type: String, trim: true },
    occupation: { type: String, trim: true },
    monthlyIncome: { type: Number, min: 0 }
}, { _id: false });

// School Support Data Schema
const schoolSupportDataSchema = new Schema<ISchoolSupportData>({
    supportType: [{
        type: String,
        enum: ['housing', 'feeding', 'books', 'supplies', 'uniform', 'transportation'],
        required: true
    }],
    numberOfStudents: { type: Number, required: true, min: 1 },
    durationNeeded: { type: String, required: true, trim: true },
    specificNeeds: { type: String, required: true, trim: true },
    preferredStartDate: { type: Date, required: true }
}, { _id: false });

// Orphanage Data Schema
const orphanageDataSchema = new Schema<IOrphanageData>({
    orphanageName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    directorName: { type: String, required: true, trim: true },
    numberOfChildren: { type: Number, required: true, min: 1 },
    ageRange: { type: String, required: true, trim: true },
    operationalNeeds: [{
        type: String,
        enum: ['food', 'clothing', 'medical', 'education', 'utilities', 'maintenance'],
        required: true
    }],
    monthlyOperatingCost: { type: Number, required: true, min: 0 },
    staffCount: { type: Number, required: true, min: 0 },
    facilityDescription: { type: String, required: true, trim: true }
}, { _id: false });

// Application Review Schema
const applicationReviewSchema = new Schema<IApplicationReview>({
    reviewedBy: { type: String, required: true }, // User ID
    reviewedAt: { type: Date, required: true, default: Date.now },
    status: { 
        type: String, 
        enum: Object.values(ApplicationStatusEnum), 
        required: true 
    },
    comments: { type: String, required: true, trim: true },
    internalNotes: { type: String, trim: true },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date }
}, { _id: false });

// Status History Schema
const statusHistorySchema = new Schema({
    status: { 
        type: String, 
        enum: Object.values(ApplicationStatusEnum), 
        required: true 
    },
    changedBy: { type: String, required: true }, // User ID
    changedAt: { type: Date, required: true, default: Date.now },
    reason: { type: String, trim: true }
}, { _id: false });

// Main Application Schema - use your existing IApplicationDocument directly
const applicationSchema = new Schema<IApplicationDocument>({
    applicantId: { 
        type: String, 
        required: true,
        index: true
    },
    applicationNumber: { 
        type: String, 
        unique: true,
        sparse: true,
        index: true 
    },
    applicationType: {
        type: String,
        enum: Object.values(ApplicationTypeEnum),
        required: true,
        index: true
    },
    
    // Basic Information
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    urgencyReason: { type: String, trim: true },
    
    // Conditional schemas based on application type
    academicInfo: academicInfoSchema,
    financialInfo: { type: financialInfoSchema, required: true },
    guardianInfo: guardianInfoSchema,
    schoolSupportData: schoolSupportDataSchema,
    orphanageData: orphanageDataSchema,
    
    // Supporting documents
    supportingDocuments: [supportingDocumentSchema],
    
    // Status and tracking
    status: {
        type: String,
        enum: Object.values(ApplicationStatusEnum),
        default: ApplicationStatusEnum.PENDING,
        index: true
    },
    priority: {
        type: String,
        enum: Object.values(PriorityLevelEnum),
        default: PriorityLevelEnum.MEDIUM,
        index: true
    },
    submittedAt: { type: Date, required: true, default: Date.now },
    lastUpdatedAt: { type: Date, required: true, default: Date.now },
    
    // Review information
    reviews: [applicationReviewSchema],
    currentReview: applicationReviewSchema,
    
    // Administrative fields
    assignedTo: { type: String, index: true }, // User ID
    estimatedCompletionDate: { type: Date },
    actualCompletionDate: { type: Date },
    rejectionReason: { type: String, trim: true },
    
    // Status history for audit trail
    statusHistory: [statusHistorySchema],
    
    // Metadata
    tags: [{ type: String, trim: true }],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
applicationSchema.index({ applicantId: 1, applicationType: 1 });
applicationSchema.index({ status: 1, priority: 1 });
applicationSchema.index({ submittedAt: -1 });
applicationSchema.index({ assignedTo: 1, status: 1 });
applicationSchema.index({ applicationNumber: 1 }, { unique: true });
applicationSchema.index({ isDeleted: 1 });

// Pre-save middleware to generate application number
applicationSchema.pre('save', async function(next) {
    if (this.isNew && (!this.applicationNumber || this.applicationNumber === '')) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        
        // Get application type prefix
        let typePrefix = '';
        switch (this.applicationType) {
            case ApplicationTypeEnum.SCHOOL_FEES:
                typePrefix = 'SF';
                break;
            case ApplicationTypeEnum.SCHOOL_SUPPORT:
                typePrefix = 'SS';
                break;
            case ApplicationTypeEnum.ORPHANAGE_DONATION:
                typePrefix = 'OD';
                break;
        }
        
        // Use the model directly
        const ApplicationModel = mongoose.model<IApplicationDocument>('Application');
        
        // Find the last application number for this type and year/month
        const lastApp = await ApplicationModel.findOne({
            applicationNumber: new RegExp(`^${typePrefix}${year}${month}`),
            applicationType: this.applicationType
        }).sort({ applicationNumber: -1 });
        
        let sequence = 1;
        if (lastApp && lastApp.applicationNumber) {
            const lastSequence = parseInt(lastApp.applicationNumber.slice(-4));
            sequence = lastSequence + 1;
        }
        
        this.applicationNumber = `${typePrefix}${year}${month}${sequence.toString().padStart(4, '0')}`;
    }
    
    // Update lastUpdatedAt
    if (this.isModified() && !this.isNew) {
        this.lastUpdatedAt = new Date();
        this.updatedAt = new Date();
    }
    
    next();
});

// Pre-update middleware
applicationSchema.pre('findOneAndUpdate', function(next) {
    this.set({ 
        lastUpdatedAt: new Date(),
        updatedAt: new Date() 
    });
    next();
});

// Validation for conditional required fields
applicationSchema.pre('validate', function(next) {
    // School fees applications require academic info
    if (this.applicationType === ApplicationTypeEnum.SCHOOL_FEES) {
        if (!this.academicInfo) {
            this.invalidate('academicInfo', 'Academic information is required for school fees applications');
        }
    }
    
    // School support applications require academic info and school support data
    if (this.applicationType === ApplicationTypeEnum.SCHOOL_SUPPORT) {
        if (!this.academicInfo) {
            this.invalidate('academicInfo', 'Academic information is required for school support applications');
        }
        if (!this.schoolSupportData) {
            this.invalidate('schoolSupportData', 'School support data is required for school support applications');
        }
    }
    
    // Orphanage donations require orphanage data
    if (this.applicationType === ApplicationTypeEnum.ORPHANAGE_DONATION) {
        if (!this.orphanageData) {
            this.invalidate('orphanageData', 'Orphanage data is required for orphanage donation applications');
        }
    }
    
    next();
});

// Instance method to add status history entry
applicationSchema.methods.addStatusHistory = function(newStatus: ApplicationStatusEnum, changedBy: string, reason?: string) {
    this.statusHistory.push({
        status: newStatus,
        changedBy,
        changedAt: new Date(),
        reason
    });
    this.status = newStatus;
    this.lastUpdatedAt = new Date();
};

// Instance method to add review
applicationSchema.methods.addReview = function(reviewData: Omit<IApplicationReview, 'reviewedAt'>) {
    const review = {
        ...reviewData,
        reviewedAt: new Date()
    };
    
    this.reviews.push(review);
    this.currentReview = review;
    this.addStatusHistory(review.status, review.reviewedBy, 'Application reviewed');
};

// Static method to get applications by status
applicationSchema.statics.getByStatus = function(status: ApplicationStatusEnum) {
    return this.find({ status, isDeleted: false });
};

// Static method to get applications by type
applicationSchema.statics.getByType = function(applicationType: ApplicationTypeEnum) {
    return this.find({ applicationType, isDeleted: false });
};

// Create and export the model directly with IApplicationDocument
const ApplicationModel = mongoose.model<IApplicationDocument>('Application', applicationSchema);

export default ApplicationModel;