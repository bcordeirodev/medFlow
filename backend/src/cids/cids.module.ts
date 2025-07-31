import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CidsService } from './cids.service';
import { CidsController } from './cids.controller';
import { Cid } from './cid.entity';
import { Medicine } from '../medicines/medicine.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cid, Medicine])],
    controllers: [CidsController],
    providers: [CidsService],
    exports: [CidsService],
})
export class CidsModule { } 