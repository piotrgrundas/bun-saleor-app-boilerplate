import type { JWTService } from "@/application/domain/services/jwt-service";
import { JoseJWTService } from "@/application/infrastructure/jwt/jose-jwt-service";

export const createJwtService = (): JWTService => new JoseJWTService();
