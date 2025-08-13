
// src/middleware/applicationValidation.ts
import { Request, Response, NextFunction } from 'express';
import { ApiResponseHelper } from '../utilities/apiResponse';
import { 
    ApplicationTypeEnum, 
    ApplicationStatusEnum, 
    PriorityLevelEnum,
    IApplicationCreateRequest,
    IApplicationUpdateRequest,
    IApplicationReviewRequest
} from '../interface';

/**
 * Validate application creation request
 */
export const validateApplicationCreation = (req: Request, res: Response, next: NextFunction) => {
    const data: IApplicationCreateRequest = req.body;
    const errors: string[] = [];

    // Required fields validation
    if (!data.applicationType) {
        errors.push('Application type is required');
    } else if (!Object.values(ApplicationTypeEnum).includes(data.applicationType)) {
        errors.push('Invalid application type');
    }

    if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
    } else if (data.title.length > 200) {
        errors.push('Title must be less than 200 characters');
    }

    if (!data.description || data.description.trim().length === 0) {
        errors.push('Description is required');
    } else if (data.description.length > 2000) {
        errors.push('Description must be less than 2000 characters');
    }

    // Financial info validation
    if (!data.financialInfo) {
        errors.push('Financial information is required');
    } else {
        if (!data.financialInfo.requestedAmount || data.financialInfo.requestedAmount <= 0) {
            errors.push('Requested amount must be greater than 0');
        } else if (data.financialInfo.requestedAmount > 10000000) {
            errors.push('Requested amount cannot exceed 10,000,000');
        }

        if (!data.financialInfo.currency) {
            errors.push('Currency is required');
        }

        if (data.financialInfo.numberOfDependents && data.financialInfo.numberOfDependents < 0) {
            errors.push('Number of dependents cannot be negative');
        }

        if (data.financialInfo.totalFamilyIncome && data.financialInfo.totalFamilyIncome < 0) {
            errors.push('Total family income cannot be negative');
        }
    }

    // Priority validation
    if (data.priority && !Object.values(PriorityLevelEnum).includes(data.priority)) {
        errors.push('Invalid priority level');
    }

    // Type-specific validations
    if (data.applicationType === ApplicationTypeEnum.SCHOOL_FEES || 
        data.applicationType === ApplicationTypeEnum.SCHOOL_SUPPORT) {
        
        if (!data.academicInfo) {
            errors.push('Academic information is required for school-related applications');
        } else {
            if (!data.academicInfo.schoolName || data.academicInfo.schoolName.trim().length === 0) {
                errors.push('School name is required');
            }
            if (!data.academicInfo.schoolAddress || data.academicInfo.schoolAddress.trim().length === 0) {
                errors.push('School address is required');
            }
            if (!data.academicInfo.studentClass || data.academicInfo.studentClass.trim().length === 0) {
                errors.push('Student class is required');
            }
            if (!data.academicInfo.academicYear || data.academicInfo.academicYear.trim().length === 0) {
                errors.push('Academic year is required');
            }
            
            // Email validation if provided
            if (data.academicInfo.schoolEmail && !isValidEmail(data.academicInfo.schoolEmail)) {
                errors.push('Invalid school email format');
            }
        }
    }

    if (data.applicationType === ApplicationTypeEnum.SCHOOL_SUPPORT) {
        if (!data.schoolSupportData) {
            errors.push('School support data is required');
        } else {
            if (!data.schoolSupportData.supportType || data.schoolSupportData.supportType.length === 0) {
                errors.push('At least one support type is required');
            }
            if (!data.schoolSupportData.numberOfStudents || data.schoolSupportData.numberOfStudents < 1) {
                errors.push('Number of students must be at least 1');
            }
            if (!data.schoolSupportData.durationNeeded) {
                errors.push('Duration needed is required');
            }
            if (!data.schoolSupportData.specificNeeds) {
                errors.push('Specific needs description is required');
            }
            if (!data.schoolSupportData.preferredStartDate) {
                errors.push('Preferred start date is required');
            } else if (new Date(data.schoolSupportData.preferredStartDate) < new Date()) {
                errors.push('Preferred start date cannot be in the past');
            }
        }
    }

    if (data.applicationType === ApplicationTypeEnum.ORPHANAGE_DONATION) {
        if (!data.orphanageData) {
            errors.push('Orphanage data is required');
        } else {
            if (!data.orphanageData.orphanageName || data.orphanageData.orphanageName.trim().length === 0) {
                errors.push('Orphanage name is required');
            }
            if (!data.orphanageData.registrationNumber || data.orphanageData.registrationNumber.trim().length === 0) {
                errors.push('Registration number is required');
            }
            if (!data.orphanageData.directorName || data.orphanageData.directorName.trim().length === 0) {
                errors.push('Director name is required');
            }
            if (!data.orphanageData.numberOfChildren || data.orphanageData.numberOfChildren < 1) {
                errors.push('Number of children must be at least 1');
            }
            if (!data.orphanageData.ageRange) {
                errors.push('Age range is required');
            }
            if (!data.orphanageData.operationalNeeds || data.orphanageData.operationalNeeds.length === 0) {
                errors.push('At least one operational need is required');
            }
            if (!data.orphanageData.monthlyOperatingCost || data.orphanageData.monthlyOperatingCost < 0) {
                errors.push('Monthly operating cost must be 0 or greater');
            }
            if (data.orphanageData.staffCount !== undefined && data.orphanageData.staffCount < 0) {
                errors.push('Staff count cannot be negative');
            }
            if (!data.orphanageData.facilityDescription) {
                errors.push('Facility description is required');
            }
        }
    }

    // Guardian info validation if provided
    if (data.guardianInfo) {
        if (!data.guardianInfo.guardianName || data.guardianInfo.guardianName.trim().length === 0) {
            errors.push('Guardian name is required when guardian info is provided');
        }
        if (!data.guardianInfo.relationship || data.guardianInfo.relationship.trim().length === 0) {
            errors.push('Guardian relationship is required when guardian info is provided');
        }
        if (!data.guardianInfo.guardianPhone || data.guardianInfo.guardianPhone.trim().length === 0) {
            errors.push('Guardian phone is required when guardian info is provided');
        }
        if (data.guardianInfo.guardianEmail && !isValidEmail(data.guardianInfo.guardianEmail)) {
            errors.push('Invalid guardian email format');
        }
        if (data.guardianInfo.monthlyIncome && data.guardianInfo.monthlyIncome < 0) {
            errors.push('Guardian monthly income cannot be negative');
        }
    }

    // Supporting documents validation
    if (data.supportingDocuments && data.supportingDocuments.length > 10) {
        errors.push('Maximum 10 supporting documents allowed');
    }

    if (errors.length > 0) {
        return ApiResponseHelper.validationError(res, errors);
    }

    next();
};

/**
 * Validate application update request
 */
export const validateApplicationUpdate = (req: Request, res: Response, next: NextFunction) => {
    const data: IApplicationUpdateRequest = req.body;
    const errors: string[] = [];

    // Only validate provided fields
    if (data.title !== undefined) {
        if (!data.title || data.title.trim().length === 0) {
            errors.push('Title cannot be empty');
        } else if (data.title.length > 200) {
            errors.push('Title must be less than 200 characters');
        }
    }

    if (data.description !== undefined) {
        if (!data.description || data.description.trim().length === 0) {
            errors.push('Description cannot be empty');
        } else if (data.description.length > 2000) {
            errors.push('Description must be less than 2000 characters');
        }
    }

    if (data.priority !== undefined && !Object.values(PriorityLevelEnum).includes(data.priority)) {
        errors.push('Invalid priority level');
    }

    // Financial info validation if provided
    if (data.financialInfo) {
        if (data.financialInfo.requestedAmount !== undefined) {
            if (data.financialInfo.requestedAmount <= 0) {
                errors.push('Requested amount must be greater than 0');
            } else if (data.financialInfo.requestedAmount > 10000000) {
                errors.push('Requested amount cannot exceed 10,000,000');
            }
        }

        if (data.financialInfo.numberOfDependents !== undefined && data.financialInfo.numberOfDependents < 0) {
            errors.push('Number of dependents cannot be negative');
        }

        if (data.financialInfo.totalFamilyIncome !== undefined && data.financialInfo.totalFamilyIncome < 0) {
            errors.push('Total family income cannot be negative');
        }
    }

    if (errors.length > 0) {
        return ApiResponseHelper.validationError(res, errors);
    }

    next();
};

/**
 * Validate application review request (Admin only)
 */
export const validateApplicationReview = (req: Request, res: Response, next: NextFunction) => {
    const data: IApplicationReviewRequest = req.body;
    const errors: string[] = [];

    if (!data.status) {
        errors.push('Status is required');
    } else if (!Object.values(ApplicationStatusEnum).includes(data.status)) {
        errors.push('Invalid status value');
    }

    if (!data.comments || data.comments.trim().length === 0) {
        errors.push('Comments are required');
    } else if (data.comments.length > 1000) {
        errors.push('Comments must be less than 1000 characters');
    }

    if (data.internalNotes && data.internalNotes.length > 1000) {
        errors.push('Internal notes must be less than 1000 characters');
    }

    if (data.followUpRequired && !data.followUpDate) {
        errors.push('Follow-up date is required when follow-up is required');
    }

    if (data.followUpDate && new Date(data.followUpDate) <= new Date()) {
        errors.push('Follow-up date must be in the future');
    }

    if (data.status === ApplicationStatusEnum.REJECTED && (!data.rejectionReason || data.rejectionReason.trim().length === 0)) {
        errors.push('Rejection reason is required when rejecting an application');
    }

    if (data.estimatedCompletionDate && new Date(data.estimatedCompletionDate) <= new Date()) {
        errors.push('Estimated completion date must be in the future');
    }

    if (errors.length > 0) {
        return ApiResponseHelper.validationError(res, errors);
    }

    next();
};

/**
 * Validate bulk status update request
 */
export const validateBulkStatusUpdate = (req: Request, res: Response, next: NextFunction) => {
    const { applicationIds, status, reason } = req.body;
    const errors: string[] = [];

    if (!applicationIds || !Array.isArray(applicationIds)) {
        errors.push('Application IDs must be an array');
    } else if (applicationIds.length === 0) {
        errors.push('At least one application ID is required');
    } else if (applicationIds.length > 50) {
        errors.push('Maximum 50 applications can be updated at once');
    }

    if (!status) {
        errors.push('Status is required');
    } else if (!Object.values(ApplicationStatusEnum).includes(status)) {
        errors.push('Invalid status value');
    }

    if (reason && reason.length > 500) {
        errors.push('Reason must be less than 500 characters');
    }

    if (errors.length > 0) {
        return ApiResponseHelper.validationError(res, errors);
    }

    next();
};

/**
 * Helper function to validate email format
 */
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};