// src/interface/application.ts
import { Document } from 'mongoose';

// Application Types
export enum ApplicationTypeEnum {
    SCHOOL_FEES = 'SCHOOL_FEES',
    SCHOOL_SUPPORT = 'SCHOOL_SUPPORT', 
    ORPHANAGE_DONATION = 'ORPHANAGE_DONATION'
}

// Application Status
export enum ApplicationStatusEnum {
    PENDING = 'PENDING',
    UNDER_REVIEW = 'UNDER_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

// Priority Level
export enum PriorityLevelEnum {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

// Academic Information for School-related applications
export interface IAcademicInfo {
    schoolName: string;
    schoolAddress: string;
    studentClass: string;
    academicYear: string;
    principalName?: string;
    schoolPhoneNumber?: string;
    schoolEmail?: string;
}

// Financial Information
export interface IFinancialInfo {
    requestedAmount: number;
    currency: string;
    breakdown?: {
        item: string;
        amount: number;
        description?: string;
    }[];
    totalFamilyIncome?: number;
    numberOfDependents?: number;
}

// Supporting Documents
export interface ISupportingDocument {
    documentType: string;
    documentUrl: string;
    documentName: string;
    uploadedAt: Date;
}

// Guardian/Contact Information
export interface IGuardianInfo {
    guardianName: string;
    relationship: string;
    guardianPhone: string;
    guardianEmail?: string;
    guardianAddress?: string;
    occupation?: string;
    monthlyIncome?: number;
}

// School Support Specific Data
export interface ISchoolSupportData {
    supportType: ('housing' | 'feeding' | 'books' | 'supplies' | 'uniform' | 'transportation')[];
    numberOfStudents: number;
    durationNeeded: string; // e.g., "1 semester", "1 academic year"
    specificNeeds: string;
    preferredStartDate: Date;
}

// Orphanage Specific Data  
export interface IOrphanageData {
    orphanageName: string;
    registrationNumber: string;
    directorName: string;
    numberOfChildren: number;
    ageRange: string;
    operationalNeeds: ('food' | 'clothing' | 'medical' | 'education' | 'utilities' | 'maintenance')[];
    monthlyOperatingCost: number;
    staffCount: number;
    facilityDescription: string;
}

// Application Review Information
export interface IApplicationReview {
    reviewedBy: string; // User ID of reviewer
    reviewedAt: Date;
    status: ApplicationStatusEnum;
    comments: string;
    internalNotes?: string;
    followUpRequired?: boolean;
    followUpDate?: Date;
}

// Main Application Interface (without Document extension)
export interface IApplication {
    _id?: string;
    applicantId: string; // Reference to User
    applicationNumber: string; // Auto-generated unique identifier
    applicationType: ApplicationTypeEnum;
    
    // Basic Information
    title: string;
    description: string;
    urgencyReason?: string;
    
    // Academic info (for school-related applications)
    academicInfo?: IAcademicInfo;
    
    // Financial information
    financialInfo: IFinancialInfo;
    
    // Guardian/Contact information
    guardianInfo?: IGuardianInfo;
    
    // Type-specific data
    schoolSupportData?: ISchoolSupportData;
    orphanageData?: IOrphanageData;
    
    // Supporting documents
    supportingDocuments: ISupportingDocument[];
    
    // Application status and tracking
    status: ApplicationStatusEnum;
    priority: PriorityLevelEnum;
    submittedAt: Date;
    lastUpdatedAt: Date;
    
    // Review information
    reviews: IApplicationReview[];
    currentReview?: IApplicationReview;
    
    // Administrative fields
    assignedTo?: string; // User ID of assigned reviewer
    estimatedCompletionDate?: Date;
    actualCompletionDate?: Date;
    rejectionReason?: string;
    
    // Audit trail
    statusHistory: {
        status: ApplicationStatusEnum;
        changedBy: string;
        changedAt: Date;
        reason?: string;
    }[];
    
    // Metadata
    tags?: string[];
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    // Mongoose document methods
    toObject?(): any;
    toJSON?(): any;
}

// Application Document Type (combines IApplication with Mongoose Document)
export type IApplicationDocument = IApplication & Document;

// Application response for API
export interface IApplicationResponse {
    id: string;
    applicationNumber: string;
    applicantId: string;
    applicationType: ApplicationTypeEnum;
    title: string;
    description: string;
    academicInfo?: IAcademicInfo;
    financialInfo: IFinancialInfo;
    guardianInfo?: IGuardianInfo;
    schoolSupportData?: ISchoolSupportData;
    orphanageData?: IOrphanageData;
    supportingDocuments: ISupportingDocument[];
    status: ApplicationStatusEnum;
    priority: PriorityLevelEnum;
    submittedAt: Date;
    lastUpdatedAt: Date;
    currentReview?: IApplicationReview;
    assignedTo?: string;
    estimatedCompletionDate?: Date;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Application creation request
export interface IApplicationCreateRequest {
    applicationType: ApplicationTypeEnum;
    title: string;
    description: string;
    urgencyReason?: string;
    academicInfo?: IAcademicInfo;
    financialInfo: IFinancialInfo;
    guardianInfo?: IGuardianInfo;
    schoolSupportData?: ISchoolSupportData;
    orphanageData?: IOrphanageData;
    supportingDocuments?: Omit<ISupportingDocument, 'uploadedAt'>[];
    priority?: PriorityLevelEnum;
    tags?: string[];
}

// Application update request
export interface IApplicationUpdateRequest {
    title?: string;
    description?: string;
    urgencyReason?: string;
    academicInfo?: IAcademicInfo;
    financialInfo?: IFinancialInfo;
    guardianInfo?: IGuardianInfo;
    schoolSupportData?: ISchoolSupportData;
    orphanageData?: IOrphanageData;
    priority?: PriorityLevelEnum;
    tags?: string[];
}

// Application review request
export interface IApplicationReviewRequest {
    status: ApplicationStatusEnum;
    comments: string;
    internalNotes?: string;
    followUpRequired?: boolean;
    followUpDate?: Date;
    rejectionReason?: string;
    estimatedCompletionDate?: Date;
}