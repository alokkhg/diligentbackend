import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

const retOne = {
  name: 'product_4',
  description: 'This is a sample description',
  price: 300,
};

const notMatch = {
  name: 'product_12',
  description: "This is a test desc",
  price: 400,
}

describe('ProductService', () => {
  let service: ProductService;
  let prodRepository: Repository<Product>;
  const PRODUCT_REPOSITORY_TOKEN = getRepositoryToken(Product);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY_TOKEN,
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
    prodRepository = module.get<Repository<Product>>(PRODUCT_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('product repository should be defined', () => {
    expect(prodRepository).toBeDefined();
  });

  describe('getOne', () => {
    it('it should test the one product', async () => {
      const servicespy = jest
        .spyOn(service, 'increaseViewCount')
        .mockResolvedValueOnce();
      const repoSpy = jest
        .spyOn(prodRepository, 'findOne')
        .mockResolvedValue(retOne as Product);
      const data = await service.findOneByName('product_2');
      expect(data).toBe(retOne);
      servicespy.mockRestore();
      repoSpy.mockRestore();
    });
    it('it should give the negative result', async () => {
      const serviceSpy = jest
        .spyOn(service, 'increaseViewCount')
        .mockResolvedValueOnce();

      const repoSpy = jest
        .spyOn(prodRepository, 'findOne')
        .mockResolvedValueOnce(retOne as Product);

      const data = await service.findOneByName('product_12');
      expect(data).not.toBe(notMatch);
    });
  });
});
