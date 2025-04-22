import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ChangePasswordDto, GetUserProfileDto, UpdateMeDto } from 'src/routes/profile/profile.dto';
import { ProfileService } from 'src/routes/profile/profile.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    @ZodSerializerDto(GetUserProfileDto)
    getProfile(@ActiveUser('userId') userId:number) {
        return this.profileService.getProfile(userId);
    }

    @Put()
    updateProfile(@ActiveUser('userId') userId:number, @Body() body:UpdateMeDto) {
        return this.profileService.updateProfile({userId,data:body});
    }
    @Put('change-password')
    @ZodSerializerDto(ChangePasswordDto)
    changePassword(@ActiveUser('userId') userId:number, @Body() body:ChangePasswordDto) {
        return this.profileService.changePassword({userId,data:body});
    }
}