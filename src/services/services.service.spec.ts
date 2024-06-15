import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './entity/service.entity';
import { Order } from 'src/orders/entity/order.entity';
import { Repository } from 'typeorm';

describe('ServicesService', () => {
  let service: ServicesService;
  let serviceRepository: Repository<Service>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    serviceRepository = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createService', () => {
    it('should create a new service', async () => {
      const createServiceDto = { name: 'Test Service', description: 'Test Description', price: 10 };
      const newService = { id: 1, ...createServiceDto } as Service;

      jest.spyOn(serviceRepository, 'save').mockResolvedValue(newService);

      const result = await service.createService(createServiceDto);
      expect(result).toBe(newService);
      expect(serviceRepository.save).toHaveBeenCalledWith(expect.objectContaining(createServiceDto));
    });
  });

  describe('getAllServices', () => {
    it('should return all services', async () => {
      const services = [
        { id: 1, name: 'Service 1', description: 'Description 1', price: 10 },
        { id: 2, name: 'Service 2', description: 'Description 2', price: 20 },
      ] as Service[];

      jest.spyOn(serviceRepository, 'find').mockResolvedValue(services);

      const result = await service.getAllServices();
      expect(result).toBe(services);
      expect(serviceRepository.find).toHaveBeenCalled();
    });
  });
});
