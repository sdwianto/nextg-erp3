import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    roleId?: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  try {
    const secret = process.env.JWT_SECRET ?? "your-secret-key";
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    next();
  };
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "fallback-secret") as Record<string, unknown>;
      req.user = {
        id: decoded.id as string,
        email: decoded.email as string,
        firstName: decoded.firstName as string | undefined,
        lastName: decoded.lastName as string | undefined,
        roleId: decoded.roleId as string | undefined,
      };
    } catch {
      // Token is invalid, but we continue without user
    }
  }

  next();
};
