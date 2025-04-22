import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ChangePasswordBodyType, UpdateMeBodyType } from 'src/routes/profile/profile.model';
import { SharedRepository } from 'src/shared/repositorys/shared.repo';
import { isUniqueContraintPrismaError } from 'src/shared/helpers'
import { HashingService } from 'src/shared/sharedServices/hashing.service';
import {  InvalidPasswordException, NotFoundRecordException, UserNotFoundException } from './error.profile';

@Injectable()
export class ProfileService {
    constructor(private readonly sharedRepo:SharedRepository,
        private readonly hashingService:HashingService
    ){}

    async getProfile(userId:number){
        const user = await this.sharedRepo.findUniqueUniqueRolePermission({id:userId,
            deletedAt:null
        })
        if(!user){
            throw  UserNotFoundException
        }
        return user
        
    }

    async updateProfile({userId,data}:{userId:number,data:UpdateMeBodyType}){
        try {
            return await this.sharedRepo.update({id:userId, deletedAt:null},
                {
                    ...data,
                    updatedById:userId
            })
        } catch (error) {
            if(isUniqueContraintPrismaError(error)){
                throw  NotFoundRecordException
            }
            throw error
        }
    }

    async changePassword({userId,data}:{userId:number,data:Omit<ChangePasswordBodyType,"confirmPassword">}){
        try {
            const {password,newPassword} = data
            const user = await this.sharedRepo.findUnique({id:userId,deletedAt:null})

            if(!user){
                throw  UserNotFoundException
            }
            const isPasswordMatch = await this.hashingService.compare(password,user.password)
            if(!isPasswordMatch){
                throw  InvalidPasswordException
            }

            const hashedPassword = await this.hashingService.hash(newPassword)
            await this.sharedRepo.update({id:userId,deletedAt:null},
                {
                    password:hashedPassword,
                    updatedById:userId
                }
            )
            return {
                message:"Password updated successfully"
            }
            
        } catch (error) {
            if(isUniqueContraintPrismaError(error)){
                throw  NotFoundRecordException
            }
            throw error
        }
    }   
}
