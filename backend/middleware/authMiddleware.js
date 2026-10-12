import jwt from "jsonwebtoken";

const authMiddleware = (request, response, next) => {
  const authorization = request.get("authorization") || "";
  const [scheme, token, extra] = authorization.split(" ");

  if (scheme !== "Bearer" || !token || extra) {
    return response.status(401).json({ success: false, message: "Authentication required" });
  }

  if (!process.env.JWT_SECRET) {
    return response.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.userId || !payload.role) {
      return response.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    request.user = { userId: payload.userId, role: payload.role };
    return next();
  } catch {
    return response.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;