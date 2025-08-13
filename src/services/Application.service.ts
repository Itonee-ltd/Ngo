
// src/services/Application.service.ts
import { Request, Response } from 'express';
import { 
    AuthenticatedRequest, 
    UserRoleEnum, 
    IApplicationCreateRequest, 
    IApplicationUpdateRequest, 
    IApplicationReviewRequest,
    ApplicationStatusEnum,
    ApplicationTypeEnum,
    PriorityLevelEnum
} from '../interface';
import { applicationRepo } from '../repository/applicationRepo';
import { userRepo } from '../repository/userRepo';
import { ApiResponseHelper, applicationStructure } from '../utilities/apiResponse';
import { sendAwsEmail } from '../config/aws-ses';
import dotenv from 'dotenv';

dotenv.config();

class ApplicationService {
    /**
     * Create a new application
     */
    async createApplication(req: AuthenticatedRequest, res: Response) {
        try {
            const applicationData: IApplicationCreateRequest = req.body;
            const { id: applicantId } = req.user;

            // Validate required fields based on application type
            const validationError = this.validateApplicationData(applicationData);
            if (validationError) {
                return ApiResponseHelper.error(res, validationError, 400);
            }

            // Create the application
            const newApplication = await applicationRepo.create({
                ...applicationData,
                applicantId,
                submittedAt: new Date(),
                lastUpdatedAt: new Date(),
                status: ApplicationStatusEnum.PENDING,
                priority: applicationData.priority || PriorityLevelEnum.MEDIUM,
                reviews: [],
                statusHistory: [{
                    status: ApplicationStatusEnum.PENDING,
                    changedBy: applicantId,
                    changedAt: new Date(),
                    reason: 'Application submitted'
                }],
                supportingDocuments: applicationData.supportingDocuments?.map(doc => ({
                    ...doc,
                    uploadedAt: new Date()
                })) || [],
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Send notification emails to admins
            await this.notifyAdminsOfNewApplication(newApplication);

            return ApiResponseHelper.success(
                res,
                { application: applicationStructure(newApplication) },
                'Application submitted successfully',
                201
            );
        } catch (error) {
            console.error('Create application error:', error);
            return ApiResponseHelper.error(res, 'Error creating application: ' + error, 500);
        }
    }

    /**
     * Get user's applications
     */
    async getUserApplications(req: AuthenticatedRequest, res: Response) {
        try {
            const { id: applicantId } = req.user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as ApplicationStatusEnum;
            const type = req.query.type as ApplicationTypeEnum;

            let filter: any = { applicantId };
            if (status) filter.status = status;
            if (type) filter.applicationType = type;

            const result = await applicationRepo.getPaginated(page, limit, filter);

            return ApiResponseHelper.success(
                res,
                {
                    applications: result.applications.map(app => applicationStructure(app)),
                    pagination: {
                        currentPage: result.currentPage,
                        totalPages: result.totalPages,
                        totalCount: result.totalCount,
                        hasNext: result.hasNext,
                        hasPrev: result.hasPrev
                    }
                },
                'Applications retrieved successfully'
            );
        } catch (error) {
            console.error('Get user applications error:', error);
            return ApiResponseHelper.error(res, 'Error retrieving applications: ' + error, 500);
        }
    }

    /**
     * Get application by ID
     */
    async getApplicationById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { id: userId, role } = req.user;

            const application = await applicationRepo.byID(id);
            if (!application) {
                return ApiResponseHelper.notFound(res, 'Application not found');
            }

            // Check if user can access this application
            if (role !== UserRoleEnum.ADMIN && application.applicantId !== userId) {
                return ApiResponseHelper.forbidden(res, 'You can only access your own applications');
            }

            return ApiResponseHelper.success(
                res,
                { application: applicationStructure(application) },
                'Application retrieved successfully'
            );
        } catch (error) {
            console.error('Get application error:', error);
            return ApiResponseHelper.error(res, 'Error retrieving application: ' + error, 500);
        }
    }

    /**
     * Update application (only by applicant and only if pending)
     */
    async updateApplication(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { id: userId } = req.user;
            const updateData: IApplicationUpdateRequest = req.body;

            const application = await applicationRepo.byID(id);
            if (!application) {
                return ApiResponseHelper.notFound(res, 'Application not found');
            }

            // Only applicant can update their own application
            if (application.applicantId !== userId) {
                return ApiResponseHelper.forbidden(res, 'You can only update your own applications');
            }

            // Only pending applications can be updated
            if (application.status !== ApplicationStatusEnum.PENDING) {
                return ApiResponseHelper.error(res, 'Only pending applications can be updated', 400);
            }

            const updatedApplication = await applicationRepo.update(id, {
                ...updateData,
                lastUpdatedAt: new Date()
            });

            return ApiResponseHelper.success(
                res,
                { application: applicationStructure(updatedApplication) },
                'Application updated successfully'
            );
        } catch (error) {
            console.error('Update application error:', error);
            return ApiResponseHelper.error(res, 'Error updating application: ' + error, 500);
        }
    }

    /**
     * Get application by application number
     */
    async getApplicationByNumber(req: AuthenticatedRequest, res: Response) {
        try {
            const { applicationNumber } = req.params;
            const { id: userId, role } = req.user;

            const application = await applicationRepo.findByApplicationNumber(applicationNumber);
            if (!application) {
                return ApiResponseHelper.notFound(res, 'Application not found');
            }

            // Check if user can access this application
            if (role !== UserRoleEnum.ADMIN && application.applicantId !== userId) {
                return ApiResponseHelper.forbidden(res, 'You can only access your own applications');
            }

            return ApiResponseHelper.success(
                res,
                { application: applicationStructure(application) },
                'Application retrieved successfully'
            );
        } catch (error) {
            console.error('Get application by number error:', error);
            return ApiResponseHelper.error(res, 'Error retrieving application: ' + error, 500);
        }
    }

    /**
     * Cancel application (only by applicant)
     */
    async cancelApplication(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { id: userId } = req.user;
            const { reason } = req.body;

            const application = await applicationRepo.byID(id);
            if (!application) {
                return ApiResponseHelper.notFound(res, 'Application not found');
            }

            // Only applicant can cancel their own application
            if (application.applicantId !== userId) {
                return ApiResponseHelper.forbidden(res, 'You can only cancel your own applications');
            }

            // Can't cancel completed, rejected, or already cancelled applications
            if ([ApplicationStatusEnum.COMPLETED, ApplicationStatusEnum.REJECTED, ApplicationStatusEnum.CANCELLED].includes(application.status)) {
                return ApiResponseHelper.error(res, 'This application cannot be cancelled', 400);
            }

            const updatedApplication = await applicationRepo.update(id, {
                status: ApplicationStatusEnum.CANCELLED,
                lastUpdatedAt: new Date(),
                $push: {
                    statusHistory: {
                        status: ApplicationStatusEnum.CANCELLED,
                        changedBy: userId,
                        changedAt: new Date(),
                        reason: reason || 'Application cancelled by applicant'
                    }
                }
            });

            return ApiResponseHelper.success(
                res,
                { application: applicationStructure(updatedApplication) },
                'Application cancelled successfully'
            );
        } catch (error) {
            console.error('Cancel application error:', error);
            return ApiResponseHelper.error(res, 'Error cancelling application: ' + error, 500);
        }
    }

    // ADMIN METHODS

    /**
     * Get all applications (Admin only)
     */
    async getAllApplications(req: AuthenticatedRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as ApplicationStatusEnum;
            const type = req.query.type as ApplicationTypeEnum;
            const priority = req.query.priority as PriorityLevelEnum;
            const assignedTo = req.query.assignedTo as string;
            const searchTerm = req.query.search as string;

            const filters: any = {};
            if (status) filters.status = [status];
            if (type) filters.applicationType = [type];
            if (priority) filters.priority = [priority];
            if (assignedTo) filters.assignedTo = assignedTo;
            if (searchTerm) filters.searchTerm = searchTerm;

            const applications = await applicationRepo.getByFilters(filters);
            
            // Apply pagination manually
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedApplications = applications.slice(startIndex, endIndex);
            const totalPages = Math.ceil(applications.length / limit);

            return ApiResponseHelper.success(
                res,
                {
                    applications: paginatedApplications.map(app => applicationStructure(app)),
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalCount: applications.length,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    }
                },
                'Applications retrieved successfully'
            );
        } catch (error) {
            console.error('Get all applications error:', error);
            return ApiResponseHelper.error(res, 'Error retrieving applications: ' + error, 500);
        }
    }

    /**
     * Review application (Admin only)
     */
    async reviewApplication(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { id: reviewerId } = req.user;
            const reviewData: IApplicationReviewRequest = req.body;

            const application = await applicationRepo.byID(id);
            if (!application) {
                return ApiResponseHelper.notFound(res, 'Application not found');
            }

            // Create review object
            const review = {
                reviewedBy: reviewerId,
                reviewedAt: new Date(),
                status: reviewData.status,
                comments: reviewData.comments,
                internalNotes: reviewData.internalNotes,
                followUpRequired: reviewData.followUpRequired || false,
                followUpDate: reviewData.followUpDate
            };

            // Update application with review
            const updateData: any = {
                status: reviewData.status,
                lastUpdatedAt: new Date(),
                currentReview: review,
                $push: {
                    reviews: review,
                    statusHistory: {
                        status: reviewData.status,
                        changedBy: reviewerId,
                        changedAt: new Date(),
                        reason: 'Application reviewed'
                    }
                }
            };

            if (reviewData.estimatedCompletionDate) {
                updateData.estimatedCompletionDate = reviewData.estimatedCompletionDate;
            }

            if (reviewData.rejectionReason) {
                updateData.rejectionReason = reviewData.rejectionReason;
            }

            if (reviewData.status === ApplicationStatusEnum.COMPLETED) {
                updateData.actualCompletionDate = new Date();
            }

            const updatedApplication = await applicationRepo.update(id, updateData);

            // Send notification to applicant
            await this.notifyApplicantOfStatusChange(updatedApplication, reviewData.status);

            return ApiResponseHelper.success(
                res,
                { application: applicationStructure(updatedApplication) },
                'Application reviewed successfully'
            );
        } catch (error) {
            console.error('Review application error:', error);
            return ApiResponseHelper.error(res, 'Error reviewing application: ' + error, 500);
        }
    }

    /**
     * Assign application to admin (Admin only)
     */
    async assignApplication(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { assignedTo } = req.body;
            const { id: assignerId } = req.user;

            const application = await applicationRepo.byID(id);
            if (!application) {
                return ApiResponseHelper.notFound(res, 'Application not found');
            }

            // Check if assignedTo user exists and is an admin
            const assignee = await userRepo.byID(assignedTo);
            if (!assignee || assignee.role !== UserRoleEnum.ADMIN) {
                return ApiResponseHelper.error(res, 'Invalid assignee. User must be an admin.', 400);
            }

            const updatedApplication = await applicationRepo.assignToUser(id, assignedTo, assignerId);

            return ApiResponseHelper.success(
                res,
                { application: applicationStructure(updatedApplication) },
                'Application assigned successfully'
            );
        } catch (error) {
            console.error('Assign application error:', error);
            return ApiResponseHelper.error(res, 'Error assigning application: ' + error, 500);
        }
    }

    /**
     * Get application statistics (Admin only)
     */
    async getApplicationStats(req: AuthenticatedRequest, res: Response) {
        try {
            const stats = await applicationRepo.getApplicationStats();

            return ApiResponseHelper.success(
                res,
                { stats },
                'Application statistics retrieved successfully'
            );
        } catch (error) {
            console.error('Get application stats error:', error);
            return ApiResponseHelper.error(res, 'Error retrieving application statistics: ' + error, 500);
        }
    }

    /**
     * Get pending applications for review (Admin only)
     */
    async getPendingApplications(req: AuthenticatedRequest, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            
            const applications = await applicationRepo.getPendingApplications(limit);

            return ApiResponseHelper.success(
                res,
                { applications: applications.map(app => applicationStructure(app)) },
                'Pending applications retrieved successfully'
            );
        } catch (error) {
            console.error('Get pending applications error:', error);
            return ApiResponseHelper.error(res, 'Error retrieving pending applications: ' + error, 500);
        }
    }

    /**
     * Bulk update application status (Admin only)
     */
    async bulkUpdateStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const { applicationIds, status, reason } = req.body;
            const { id: updatedBy } = req.user;

            if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
                return ApiResponseHelper.error(res, 'Application IDs are required', 400);
            }

            if (!Object.values(ApplicationStatusEnum).includes(status)) {
                return ApiResponseHelper.error(res, 'Invalid status provided', 400);
            }

            await applicationRepo.bulkUpdateStatus(applicationIds, status, updatedBy, reason);

            return ApiResponseHelper.success(
                res,
                null,
                `Successfully updated ${applicationIds.length} applications`
            );
        } catch (error) {
            console.error('Bulk update status error:', error);
            return ApiResponseHelper.error(res, 'Error updating applications: ' + error, 500);
        }
    }

    // PRIVATE HELPER METHODS

    private validateApplicationData(data: IApplicationCreateRequest): string | null {
        if (!data.applicationType) {
            return 'Application type is required';
        }

        if (!data.title || !data.description || !data.financialInfo) {
            return 'Title, description, and financial information are required';
        }

        if (!data.financialInfo.requestedAmount || data.financialInfo.requestedAmount <= 0) {
            return 'Valid requested amount is required';
        }

        // Validate based on application type
        switch (data.applicationType) {
            case ApplicationTypeEnum.SCHOOL_FEES:
                if (!data.academicInfo) {
                    return 'Academic information is required for school fees applications';
                }
                break;

            case ApplicationTypeEnum.SCHOOL_SUPPORT:
                if (!data.academicInfo || !data.schoolSupportData) {
                    return 'Academic information and school support data are required for school support applications';
                }
                break;

            case ApplicationTypeEnum.ORPHANAGE_DONATION:
                if (!data.orphanageData) {
                    return 'Orphanage data is required for orphanage donation applications';
                }
                break;
        }

        return null;
    }

    private async notifyAdminsOfNewApplication(application: any): Promise<void> {
        try {
            // Get all admin users
            const admins = await userRepo.find({ 
                role: UserRoleEnum.ADMIN, 
                isActive: true, 
                emailVerified: true 
            });

            const emailPromises = admins.map(admin => 
                sendAwsEmail(
                    admin.email,
                    `New Application Submitted - ${application.applicationNumber}`,
                    `
                    <h2>New Grant Application Submitted</h2>
                    <p>A new application has been submitted and requires review:</p>
                    <ul>
                        <li><strong>Application Number:</strong> ${application.applicationNumber}</li>
                        <li><strong>Type:</strong> ${application.applicationType}</li>
                        <li><strong>Title:</strong> ${application.title}</li>
                        <li><strong>Requested Amount:</strong> ${application.financialInfo.currency} ${application.financialInfo.requestedAmount.toLocaleString()}</li>
                        <li><strong>Priority:</strong> ${application.priority}</li>
                        <li><strong>Submitted:</strong> ${application.submittedAt.toLocaleDateString()}</li>
                    </ul>
                    <p>Please log in to the admin dashboard to review this application.</p>
                    `
                )
            );

            await Promise.allSettled(emailPromises);
        } catch (error) {
            console.error('Error sending admin notifications:', error);
            // Don't throw error as this shouldn't fail the application creation
        }
    }

    private async notifyApplicantOfStatusChange(application: any, newStatus: ApplicationStatusEnum): Promise<void> {
        try {
            const applicant = await userRepo.byID(application.applicantId);
            if (!applicant || !applicant.emailVerified) return;

            let statusMessage = '';
            let statusColor = '#333';

            switch (newStatus) {
                case ApplicationStatusEnum.APPROVED:
                    statusMessage = 'Your application has been approved!';
                    statusColor = '#28a745';
                    break;
                case ApplicationStatusEnum.REJECTED:
                    statusMessage = 'Your application has been rejected.';
                    statusColor = '#dc3545';
                    break;
                case ApplicationStatusEnum.UNDER_REVIEW:
                    statusMessage = 'Your application is now under review.';
                    statusColor = '#ffc107';
                    break;
                case ApplicationStatusEnum.COMPLETED:
                    statusMessage = 'Your application has been completed!';
                    statusColor = '#28a745';
                    break;
                default:
                    statusMessage = `Your application status has been updated to ${newStatus}.`;
            }

            await sendAwsEmail(
                applicant.email,
                `Application Status Update - ${application.applicationNumber}`,
                `
                <h2 style="color: ${statusColor};">${statusMessage}</h2>
                <p>Your application details:</p>
                <ul>
                    <li><strong>Application Number:</strong> ${application.applicationNumber}</li>
                    <li><strong>Title:</strong> ${application.title}</li>
                    <li><strong>New Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${newStatus}</span></li>
                    <li><strong>Updated On:</strong> ${new Date().toLocaleDateString()}</li>
                </ul>
                ${application.currentReview?.comments ? `
                <h3>Reviewer Comments:</h3>
                <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">${application.currentReview.comments}</p>
                ` : ''}
                <p>You can check your application status by logging into your account.</p>
                `
            );
        } catch (error) {
            console.error('Error sending applicant notification:', error);
            // Don't throw error as this shouldn't fail the review process
        }
    }

    // Express-compatible wrapper methods
    createApplicationHandler = (req: Request, res: Response) => {
        return this.createApplication(req as AuthenticatedRequest, res);
    };

    getUserApplicationsHandler = (req: Request, res: Response) => {
        return this.getUserApplications(req as AuthenticatedRequest, res);
    };

    getApplicationByIdHandler = (req: Request, res: Response) => {
        return this.getApplicationById(req as AuthenticatedRequest, res);
    };

    updateApplicationHandler = (req: Request, res: Response) => {
        return this.updateApplication(req as AuthenticatedRequest, res);
    };

    getApplicationByNumberHandler = (req: Request, res: Response) => {
        return this.getApplicationByNumber(req as AuthenticatedRequest, res);
    };

    cancelApplicationHandler = (req: Request, res: Response) => {
        return this.cancelApplication(req as AuthenticatedRequest, res);
    };

    // Admin handlers
    getAllApplicationsHandler = (req: Request, res: Response) => {
        return this.getAllApplications(req as AuthenticatedRequest, res);
    };

    reviewApplicationHandler = (req: Request, res: Response) => {
        return this.reviewApplication(req as AuthenticatedRequest, res);
    };

    assignApplicationHandler = (req: Request, res: Response) => {
        return this.assignApplication(req as AuthenticatedRequest, res);
    };

    getApplicationStatsHandler = (req: Request, res: Response) => {
        return this.getApplicationStats(req as AuthenticatedRequest, res);
    };

    getPendingApplicationsHandler = (req: Request, res: Response) => {
        return this.getPendingApplications(req as AuthenticatedRequest, res);
    };

    bulkUpdateStatusHandler = (req: Request, res: Response) => {
        return this.bulkUpdateStatus(req as AuthenticatedRequest, res);
    };
}

export default new ApplicationService();