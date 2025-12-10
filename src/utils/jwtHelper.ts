import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-super-segura";

interface TokenPayload {
  clienteId: number;
  email: string;
}

export class JwtHelper {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d"
    });
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }
}
