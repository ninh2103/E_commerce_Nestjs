import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SharedRepository } from 'src/shared/repositorys/shared.repo';

@Module({
  providers: [ProfileService,SharedRepository],
  controllers: [ProfileController]
})
export class ProfileModule {}
