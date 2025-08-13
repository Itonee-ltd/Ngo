// src/routes/applications.ts
import { Router } from 'express';
import ApplicationService from '../services/Application.service';
import { authenticateUser, requireRole } from '../middleware/auth';
import { 
    validateApplicationCreation,
    validateApplicationUpdate,
    validateApplicationReview,
    validateBulkStatusUpdate
} from '../middleware/applicationValidation';
import { UserRoleEnum } from '../interface';

const router = Router();

// PUBLIC/USER ROUTES (Require Authentication)

// Create new application
router.post('/', 
    authenticateUser as any,
    validateApplicationCreation,
    ApplicationService.createApplicationHandler
);

// Get user's own applications
router.get('/my-applications', 
    authenticateUser as any, 
    ApplicationService.getUserApplicationsHandler
);

// Get application by ID (user can only access their own)
router.get('/:id', 
    authenticateUser as any, 
    ApplicationService.getApplicationByIdHandler
);

// Get application by application number
router.get('/number/:applicationNumber', 
    authenticateUser as any, 
    ApplicationService.getApplicationByNumberHandler
);

// Update application (only pending applications by owner)
router.put('/:id', 
    authenticateUser as any,
    validateApplicationUpdate,
    ApplicationService.updateApplicationHandler
);

// Cancel application (only by owner)
router.patch('/:id/cancel', 
    authenticateUser as any, 
    ApplicationService.cancelApplicationHandler
);

// ADMIN ONLY ROUTES

// Get all applications (admin only)
router.get('/admin/all', 
    authenticateUser as any, 
    requireRole([UserRoleEnum.ADMIN]) as any,
    ApplicationService.getAllApplicationsHandler
);

// Get application statistics (admin only)
router.get('/admin/stats', 
    authenticateUser as any, 
    requireRole([UserRoleEnum.ADMIN]) as any,
    ApplicationService.getApplicationStatsHandler
);

// Get pending applications for review (admin only)
router.get('/admin/pending', 
    authenticateUser as any, 
    requireRole([UserRoleEnum.ADMIN]) as any,
    ApplicationService.getPendingApplicationsHandler
);

// Review application (admin only)
router.post('/:id/review', 
    authenticateUser as any, 
    requireRole([UserRoleEnum.ADMIN]) as any,
    validateApplicationReview,
    ApplicationService.reviewApplicationHandler
);

// Assign application to admin (admin only)
router.patch('/:id/assign', 
    authenticateUser as any, 
    requireRole([UserRoleEnum.ADMIN]) as any,
    ApplicationService.assignApplicationHandler
);

// Bulk update application status (admin only)
router.patch('/admin/bulk-update', 
    authenticateUser as any, 
    requireRole([UserRoleEnum.ADMIN]) as any,
    validateBulkStatusUpdate,
    ApplicationService.bulkUpdateStatusHandler
);

export default router;