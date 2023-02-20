import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

// This will be an e2e test

describe('ProductController', () => {
  let controller: ProductController;
  let spyService: ProductService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    spyService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(spyService).toBeDefined();
  });

  describe('findAll', () => {
    it('should get the product by name', async () => {
      let result: Promise<Product[]>;
      jest.spyOn(spyService, 'findAll').mockImplementation(() => result);
      expect(await controller.findAll()).toBe(result);
    });
  });
});
