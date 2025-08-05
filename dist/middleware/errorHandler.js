"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const apiResponse_1 = require("../utilities/apiResponse");
const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return apiResponse_1.ApiResponseHelper.error(res, `${field} already exists`, 400);
    }
    if (err.name === 'ValidationError') {
        return apiResponse_1.ApiResponseHelper.error(res, 'Validation Error', 400, err.message);
    }
    if (err.name === 'CastError') {
        return apiResponse_1.ApiResponseHelper.error(res, 'Invalid ID format', 400);
    }
    if (err.name === 'JsonWebTokenError') {
        return apiResponse_1.ApiResponseHelper.unauthorized(res, 'Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
        return apiResponse_1.ApiResponseHelper.unauthorized(res, 'Token expired');
    }
    return apiResponse_1.ApiResponseHelper.error(res, err.message || 'Internal server error', err.statusCode || 500);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    return apiResponse_1.ApiResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map