"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStructure = exports.ApiResponseHelper = void 0;
class ApiResponseHelper {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            statusCode
        });
    }
    static error(res, message = 'An error occurred', statusCode = 500, error) {
        return res.status(statusCode).json({
            success: false,
            message,
            error,
            statusCode
        });
    }
    static validationError(res, errors, message = 'Validation failed') {
        return res.status(400).json({
            success: false,
            message,
            error: errors,
            statusCode: 400
        });
    }
    static unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            success: false,
            message,
            statusCode: 401
        });
    }
    static forbidden(res, message = 'Forbidden access') {
        return res.status(403).json({
            success: false,
            message,
            statusCode: 403
        });
    }
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message,
            statusCode: 404
        });
    }
}
exports.ApiResponseHelper = ApiResponseHelper;
const userStructure = (user) => {
    let userObj;
    if (user && typeof user.toObject === 'function') {
        userObj = user.toObject();
    }
    else if (user && typeof user.toJSON === 'function') {
        userObj = user.toJSON();
    }
    else {
        userObj = user;
    }
    return {
        id: userObj._id || userObj.id,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        phone: userObj.phone,
        address: userObj.address,
        role: userObj.role,
        isActive: userObj.isActive,
        emailVerified: userObj.emailVerified,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
    };
};
exports.userStructure = userStructure;
//# sourceMappingURL=apiResponse.js.map