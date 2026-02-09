import type { JWKSRepository } from "@/application/domain/repositories/jwks-repository";
import type { JWKSService } from "@/application/domain/services/jwks-service";
import { JoseJWKSRepository } from "@/application/infrastructure/jwks/jose-jwks-repository";
import { JoseJWKSService } from "@/application/infrastructure/jwks/jose-jwks-service";

export const createJwksRepository = (): JWKSRepository => new JoseJWKSRepository();

export const createJwksService = (jwksRepository: JWKSRepository): JWKSService =>
  new JoseJWKSService(jwksRepository);
