import type { Request, Response, NextFunction } from "express";
import { JwtHelper } from "../utils/jwtHelper";
import { UnauthorizedError } from "../application/errors/UnauthorizedError";

export interface AuthenticatedRequest extends Request {
  clienteId?: number;
}

export function authMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Token não fornecido");
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedError("Formato de token inválido");
    }

    const payload = JwtHelper.verifyToken(token);
    request.clienteId = payload.clienteId;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError("Token inválido ou expirado"));
    }
  }
}
