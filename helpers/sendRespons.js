const Response = (response = {}) => {
    const responseObject = {
        status: response.status,
        statusCode: response.statusCode,
        message: response.message,
        data: {},
    };

    if (response.type) {
        responseObject.data.type = response.type;
    }

    if (response.data) {
        responseObject.data.attributes = response.data;
    }

    if (response.token) {
        responseObject.data.token = response.token;
    }

    if (response.pagination) {
        responseObject.pagination = response.pagination;
    }

    return responseObject;
};

const sendResponse = (res, status, statusCode, data = null, message = null, type = null, token = null, pagination = null) => {
    const statusMessages = {
        200: 'OK',
        201: 'Created',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
    };

    const response = {
        status: status || 'OK',
        statusCode: statusCode || 200,
        message: message || statusMessages[statusCode] || 'Unknown Status',
        data: data || null,
        type: type || null,
        token: token || null,
        pagination: pagination || null,
    };

    const responseObject = Response(response);
    res.status(responseObject.statusCode).json(responseObject);
};

module.exports = sendResponse;
