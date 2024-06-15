import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateServiceDto } from './dtos/create-service.dto';

@Controller('services')
export class ServicesController {
    constructor(private servicesService:ServicesService){}
    @UseGuards(AuthGuard)
    @Post()
    async createService(@Request() req:any,@Body() createServiceDto:CreateServiceDto){
        return this.servicesService.createService(createServiceDto);
    }
    @UseGuards(AuthGuard)
    @Get()
    async getAllServices(){
        return this.servicesService.getAllServices();
    }
}
