// src/repository/applicationRepo.ts
import { BaseRepository, TDoc } from './baseRepo';
import ApplicationModel from '../models/Application';
import { 
    IApplicationDocument, 
    ApplicationStatusEnum, 
    ApplicationTypeEnum, 
    PriorityLevelEnum 
} from '../interface';
import { FilterQuery } from 'mongoose';

class ApplicationRepository extends BaseRepository<IApplicationDocument> {
    constructor() {
        super(ApplicationModel);
    }

    // Alias methods to match your existing code patterns
    async byQuery(filter: FilterQuery<IApplicationDocument>): Promise<TDoc<IApplicationDocument> | null> {
        return this.findOne({ ...filter, isDeleted: false });
    }

    async byID(id: string): Promise<TDoc<IApplicationDocument> | null> {
        return this.findById(id);
    }

    async update(id: string, data: Partial<IApplicationDocument>): Promise<TDoc<IApplicationDocument> | null> {
        return this.updateById(id, data);
    }

    // Get all applications with optional filtering and pagination
    async all(
        filter: FilterQuery<IApplicationDocument> = {}, 
        options?: any
    ): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            ...filter,
            isDeleted: false
        }, undefined, options);
    }

    // Get applications by applicant ID
    async getByApplicant(applicantId: string): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            applicantId,
            isDeleted: false
        }, undefined, { sort: { submittedAt: -1 } });
    }

    // Get applications by status
    async getByStatus(status: ApplicationStatusEnum): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            status,
            isDeleted: false
        }, undefined, { sort: { submittedAt: -1 } });
    }

    // Get applications by type
    async getByType(applicationType: ApplicationTypeEnum): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            applicationType,
            isDeleted: false
        }, undefined, { sort: { submittedAt: -1 } });
    }

    // Get applications by priority
    async getByPriority(priority: PriorityLevelEnum): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            priority,
            isDeleted: false
        }, undefined, { sort: { submittedAt: -1 } });
    }

    // Get applications assigned to a specific user
    async getAssignedToUser(assignedTo: string): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            assignedTo,
            isDeleted: false
        }, undefined, { sort: { submittedAt: -1 } });
    }

    // Get pending applications for admin review
    async getPendingApplications(limit?: number): Promise<TDoc<IApplicationDocument>[]> {
        const options: any = { 
            sort: { 
                priority: 1, // High priority first (assuming HIGH=1, MEDIUM=2, etc.)
                submittedAt: 1 // Older applications first
            } 
        };
        
        if (limit) {
            options.limit = limit;
        }

        return this.find({
            status: { $in: [ApplicationStatusEnum.PENDING, ApplicationStatusEnum.UNDER_REVIEW] },
            isDeleted: false
        }, undefined, options);
    }

    // Get applications requiring follow-up
    async getRequiringFollowUp(): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            'currentReview.followUpRequired': true,
            'currentReview.followUpDate': { $lte: new Date() },
            status: { $nin: [ApplicationStatusEnum.COMPLETED, ApplicationStatusEnum.CANCELLED] },
            isDeleted: false
        }, undefined, { sort: { 'currentReview.followUpDate': 1 } });
    }

    // Search applications by text
    async searchApplications(searchTerm: string): Promise<TDoc<IApplicationDocument>[]> {
        const searchRegex = new RegExp(searchTerm, 'i');
        
        return this.find({
            $or: [
                { applicationNumber: searchRegex },
                { title: searchRegex },
                { description: searchRegex },
                { 'academicInfo.schoolName': searchRegex },
                { 'orphanageData.orphanageName': searchRegex }
            ],
            isDeleted: false
        }, undefined, { sort: { submittedAt: -1 } });
    }

    // Get applications by date range
    async getByDateRange(startDate: Date, endDate: Date): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            submittedAt: {
                $gte: startDate,
                $lte: endDate
            },
            isDeleted: false
        }, undefined, { sort: { submittedAt: -1 } });
    }

    // Get application statistics
    async getApplicationStats(): Promise<{
        total: number;
        byStatus: Record<ApplicationStatusEnum, number>;
        byType: Record<ApplicationTypeEnum, number>;
        byPriority: Record<PriorityLevelEnum, number>;
        thisMonth: number;
        thisWeek: number;
    }> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

        // Get all applications (not deleted)
        const allApplications = await this.find({ isDeleted: false });
        
        // Initialize counters
        const byStatus = {} as Record<ApplicationStatusEnum, number>;
        const byType = {} as Record<ApplicationTypeEnum, number>;
        const byPriority = {} as Record<PriorityLevelEnum, number>;

        // Initialize all enum values to 0
        Object.values(ApplicationStatusEnum).forEach(status => {
            byStatus[status] = 0;
        });
        Object.values(ApplicationTypeEnum).forEach(type => {
            byType[type] = 0;
        });
        Object.values(PriorityLevelEnum).forEach(priority => {
            byPriority[priority] = 0;
        });

        let thisMonth = 0;
        let thisWeek = 0;

        // Count applications
        allApplications.forEach(app => {
            byStatus[app.status]++;
            byType[app.applicationType]++;
            byPriority[app.priority]++;

            if (app.submittedAt >= startOfMonth) {
                thisMonth++;
            }
            if (app.submittedAt >= startOfWeek) {
                thisWeek++;
            }
        });

        return {
            total: allApplications.length,
            byStatus,
            byType,
            byPriority,
            thisMonth,
            thisWeek
        };
    }

    // Find application by application number
    async findByApplicationNumber(applicationNumber: string): Promise<TDoc<IApplicationDocument> | null> {
        return this.findOne({
            applicationNumber,
            isDeleted: false
        });
    }

    // Get applications with pagination and filtering
    async getPaginated(
        page: number = 1,
        limit: number = 10,
        filter: FilterQuery<IApplicationDocument> = {},
        sortBy: string = 'submittedAt',
        sortOrder: 'asc' | 'desc' = 'desc'
    ): Promise<{
        applications: TDoc<IApplicationDocument>[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
        hasNext: boolean;
        hasPrev: boolean;
    }> {
        const skip = (page - 1) * limit;
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const queryFilter = {
            ...filter,
            isDeleted: false
        };

        const [applications, totalCount] = await Promise.all([
            this.find(queryFilter, undefined, {
                skip,
                limit,
                sort: sortOptions
            }),
            this.count(queryFilter)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            applications,
            totalCount,
            totalPages,
            currentPage: page,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    }

    // Assign application to user
    async assignToUser(applicationId: string, assignedTo: string, assignedBy: string): Promise<TDoc<IApplicationDocument> | null> {
        const application = await this.updateById(applicationId, {
            assignedTo,
            lastUpdatedAt: new Date(),
            $push: {
                statusHistory: {
                    status: ApplicationStatusEnum.UNDER_REVIEW,
                    changedBy: assignedBy,
                    changedAt: new Date(),
                    reason: `Assigned to user ${assignedTo}`
                }
            }
        });

        return application;
    }

    // Bulk update applications
    async bulkUpdateStatus(
        applicationIds: string[],
        status: ApplicationStatusEnum,
        updatedBy: string,
        reason?: string
    ): Promise<void> {
        await ApplicationModel.updateMany(
            { _id: { $in: applicationIds }, isDeleted: false },
            {
                $set: {
                    status,
                    lastUpdatedAt: new Date(),
                    updatedAt: new Date()
                },
                $push: {
                    statusHistory: {
                        status,
                        changedBy: updatedBy,
                        changedAt: new Date(),
                        reason: reason || `Bulk status update to ${status}`
                    }
                }
            }
        );
    }

    // Soft delete application
    async softDelete(id: string): Promise<TDoc<IApplicationDocument> | null> {
        return this.updateById(id, {
            isDeleted: true,
            deletedAt: new Date(),
            lastUpdatedAt: new Date()
        });
    }

    // Restore soft deleted application
    async restore(id: string): Promise<TDoc<IApplicationDocument> | null> {
        return this.updateById(id, {
            isDeleted: false,
            deletedAt: undefined,
            lastUpdatedAt: new Date()
        });
    }

    // Get overdue applications (past estimated completion date)
    async getOverdueApplications(): Promise<TDoc<IApplicationDocument>[]> {
        return this.find({
            estimatedCompletionDate: { $lt: new Date() },
            status: { $nin: [ApplicationStatusEnum.COMPLETED, ApplicationStatusEnum.CANCELLED, ApplicationStatusEnum.REJECTED] },
            isDeleted: false
        }, undefined, { sort: { estimatedCompletionDate: 1 } });
    }

    // Get applications by multiple filters (for advanced search)
    async getByFilters(filters: {
        status?: ApplicationStatusEnum[];
        applicationType?: ApplicationTypeEnum[];
        priority?: PriorityLevelEnum[];
        assignedTo?: string;
        applicantId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        searchTerm?: string;
    }): Promise<TDoc<IApplicationDocument>[]> {
        const query: FilterQuery<IApplicationDocument> = { isDeleted: false };

        if (filters.status && filters.status.length > 0) {
            query.status = { $in: filters.status };
        }

        if (filters.applicationType && filters.applicationType.length > 0) {
            query.applicationType = { $in: filters.applicationType };
        }

        if (filters.priority && filters.priority.length > 0) {
            query.priority = { $in: filters.priority };
        }

        if (filters.assignedTo) {
            query.assignedTo = filters.assignedTo;
        }

        if (filters.applicantId) {
            query.applicantId = filters.applicantId;
        }

        if (filters.dateFrom || filters.dateTo) {
            query.submittedAt = {};
            if (filters.dateFrom) {
                query.submittedAt.$gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                query.submittedAt.$lte = filters.dateTo;
            }
        }

        if (filters.searchTerm) {
            const searchRegex = new RegExp(filters.searchTerm, 'i');
            query.$or = [
                { applicationNumber: searchRegex },
                { title: searchRegex },
                { description: searchRegex },
                { 'academicInfo.schoolName': searchRegex },
                { 'orphanageData.orphanageName': searchRegex }
            ];
        }

        return this.find(query, undefined, { sort: { submittedAt: -1 } });
    }
}

export const applicationRepo = new ApplicationRepository();
export default ApplicationRepository;