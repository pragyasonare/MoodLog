
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User'); // Import your user model


module.exports = async (req, res, next) => {
  // 1. Extract token from header
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  
  // 2. Handle missing token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication token required',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    // 3. Verify token with all security options
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      ignoreExpiration: false,
      maxAge: '7d' // Ensures token isn't too old
    });

    // 4. Validate and convert user ID
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid user identifier',
        code: 'INVALID_USER_ID'
      });
    }

    // 5. Attach standardized user object
    req.user = {
      id: new mongoose.Types.ObjectId(decoded.id), // Proper ObjectId
      _id: new mongoose.Types.ObjectId(decoded.id), // Alternate reference
      role: decoded.role || 'user'
    };


    // 6. Token renewal logic (if expiring within 30 mins)
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0 && expiresIn < 1800) {
      const newToken = jwt.sign(
        { 
          id: decoded.id,
          role: decoded.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.set('X-Renewed-Token', newToken);
    }

    next();
  } catch (err) {
    // 7. Detailed error handling
    let status = 401;
    let error, code;

    switch (err.name) {
      case 'TokenExpiredError':
        error = 'Session expired - please login again';
        code = 'TOKEN_EXPIRED';
        break;
      case 'JsonWebTokenError':
        error = 'Invalid authentication token';
        code = 'INVALID_TOKEN';
        break;
      case 'NotBeforeError':
        status = 403;
        error = 'Token not yet valid';
        code = 'TOKEN_EARLY';
        break;
      default:
        error = 'Authentication failed';
        code = 'AUTH_ERROR';
    }

    res.status(status).json({ 
      success: false,
      error,
      code,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

  