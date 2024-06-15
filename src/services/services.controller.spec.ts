import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { Service } from './entity/service.entity'; 
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: {
            createService: jest.fn(),
            getAllServices: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createService', () => {
    it('should create a new service', async () => {
      const createServiceDto: CreateServiceDto = { name: 'Test Service', description: 'Test Description', price: 10 };
      const newService = { id: 1, ...createServiceDto } as Service;

      jest.spyOn(service, 'createService').mockResolvedValue(newService);

      const result = await controller.createService({ user: { sub: 1 } }, createServiceDto);
      expect(result).toBe(newService);
      expect(service.createService).toHaveBeenCalledWith(createServiceDto);
    });
  });

  describe('getAllServices', () => {
    it('should return all services', async () => {
      const services = [
        { id: 1, name: 'Service 1', description: 'Description 1', price: 10 },
        { id: 2, name: 'Service 2', description: 'Description 2', price: 20 },
      ] as Service[];

      jest.spyOn(service, 'getAllServices').mockResolvedValue(services);

      const result = await controller.getAllServices();
      expect(result).toBe(services);
      expect(service.getAllServices).toHaveBeenCalled();
    });
  });
});
