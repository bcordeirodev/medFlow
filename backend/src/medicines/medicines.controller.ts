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
} from "@nestjs/common";
import { MedicinesService } from "./medicines.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("medicines")
@UseGuards(JwtAuthGuard)
export class MedicinesController {
    constructor(private readonly medicinesService: MedicinesService) { }

    @Post()
    create(@Body() createMedicineDto: any) {
        return this.medicinesService.create(createMedicineDto);
    }

    @Get()
    findAll(@Query("search") search?: string) {
        if (search) {
            return this.medicinesService.search(search);
        }
        return this.medicinesService.findAll();
    }

    @Get("search")
    search(@Query("q") query: string) {
        return this.medicinesService.search(query);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.medicinesService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateMedicineDto: any) {
        return this.medicinesService.update(+id, updateMedicineDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.medicinesService.remove(+id);
    }
}
