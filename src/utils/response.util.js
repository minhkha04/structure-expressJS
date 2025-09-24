export const successResponse = (res, data = {}, message = "Success") => {
    return res.json({
        success: true,
        data,
        message,
    });
};

export const errorResponse = (res, error, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message: error.message || "Error occurred",
        errors: error.details || null,
    });
};
