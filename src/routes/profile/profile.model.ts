import { UserSchema } from "src/shared/models/shared-user.model";
import { z } from "zod";

export const UpdateMeBodySchema = UserSchema.pick({
    name:true,
    phoneNumber:true,
    avatar:true
})

export type UpdateMeBodyType = z.infer<typeof UpdateMeBodySchema>

export const ChangePasswordBodySchema = z.object({
    password:z.string(),
    newPassword:z.string(),
    confirmPassword:z.string()
}).superRefine((data,ctx)=>{
    if(data.newPassword !== data.confirmPassword){
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            message:"Password and confirm password do not match"
        })
    }
})

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>


