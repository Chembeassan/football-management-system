const jwt = require("jsonwebtoken");

// Middleware factory: pass allowed roles for each route
function auth(allowedRoles = []) {
  return (req, res, next) => {
    try {
      // 1. Extract token from Authorization header
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1]; // "Bearer <token>"
      if (!token) {
        return res.status(401).json({ error: "Token missing" });
      }

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // 3. Attach user info to request
      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      // 4. Role-based authorization
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }

      // 5. Continue to controller
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = auth;
