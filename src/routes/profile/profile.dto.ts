import { createZodDto } from "nestjs-zod";
import { ChangePasswordBodySchema, UpdateMeBodySchema } from "src/routes/profile/profile.model";
import { GetUserProfileSchema, UpdateProfileSchema } from "src/shared/models/shared-user.model";

export class GetUserProfileDto extends createZodDto(GetUserProfileSchema) {}

export class UpdateUserProfileDto extends createZodDto(UpdateProfileSchema) {}

export class ChangePasswordDto extends createZodDto(ChangePasswordBodySchema) {}

export class UpdateMeDto extends createZodDto(UpdateMeBodySchema) {}
