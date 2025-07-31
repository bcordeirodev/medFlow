import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { CidsService } from './cids.service';
import { CreateCidDto } from './dto/create-cid.dto';
import { UpdateCidDto } from './dto/update-cid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cids')
@UseGuards(JwtAuthGuard)
export class CidsController {
    constructor(private readonly cidsService: CidsService) { }

    @Post()
    create(@Body() createCidDto: CreateCidDto) {
        return this.cidsService.create(createCidDto);
    }

    @Get()
    findAll(@Query('code') code?: string) {
        if (code) {
            return this.cidsService.findByCode(code);
        }
        return this.cidsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cidsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCidDto: UpdateCidDto) {
        return this.cidsService.update(+id, updateCidDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cidsService.remove(+id);
    }

    @Post(':id/medicines/:medicineId')
    addMedicineToCid(
        @Param('id') id: string,
        @Param('medicineId') medicineId: string,
    ) {
        return this.cidsService.addMedicineToCid(+id, +medicineId);
    }

    @Delete(':id/medicines/:medicineId')
    removeMedicineFromCid(
        @Param('id') id: string,
        @Param('medicineId') medicineId: string,
    ) {
        return this.cidsService.removeMedicineFromCid(+id, +medicineId);
    }
} 