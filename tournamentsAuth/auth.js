const jwt = require("jsonwebtoken");

function auth(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader)
        return res.status(401).json({ error: "Authorization header missing" });

      const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token missing" });

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = { id: decoded.userId, role: decoded.role };

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = auth;
