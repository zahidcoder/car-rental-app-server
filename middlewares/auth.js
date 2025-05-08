const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateUser = (req, res, next) => {
  try {
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    // Check if the token exists and starts with 'Bearer '
    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    // If token is missing, return 401 Unauthorized
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Token is missing.',
        status: 'failed',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return 401 Unauthorized
    return res.status(401).json({
      statusCode: 401,
      message: 'Invalid token.',
      status: 'failed',
    });
  }
};

module.exports = authenticateUser;
