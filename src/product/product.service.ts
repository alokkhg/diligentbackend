import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private readonly httpService: HttpService,
  ) {}

  // function to create the records in the mysql
  async create(createProductDto: CreateProductDto) {
    const createProduct = this.productRepo.create({
      name: createProductDto.name,
      price: createProductDto.price,
      active: true,
      view_count: 0,
    });

    if (typeof createProductDto.description !== 'undefined') {
      createProduct.description = createProductDto.description;
    }

    return await this.productRepo.insert(createProductDto);
  }

  async findAll() {
    return await this.productRepo.find();
  }

  async findOneByName(pName: string, currency?: string) {
    const lCurrency = typeof currency !== undefined ? currency : 'USD';
    const retProd = await this.productRepo.findOne({
      where: {
        name: pName,
        active: true,
      },
    });

    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: 'apikey 880IX9uh6RPMqCVKDJO6SFucwISJz3iB',
      },
      params: {
        from: 'USD',
        to: lCurrency,
        amount: retProd.price,
      },
    };

    const price = await this.httpService.get(
      'https://api.apilayer.com/currency_data/convert',
      requestConfig,
    );

    // lets print the price first
    console.log(price);
    return retProd;
  }

  async listMostViewedProduct(count?: number) {
    let resCount = 5;
    if (typeof count !== 'undefined') {
      resCount = count;
    }
    return await this.productRepo.find({
      where: {
        view_count: MoreThan(0),
        active: true,
      },
      order: {
        view_count: 'desc',
      },
      take: resCount,
    });
  }

  async increaseViewCount(pName: string) {
    await this.productRepo
      .createQueryBuilder()
      .update(Product)
      .set({
        view_count: () => 'view_count + 1',
      })
      .where('name = :name', { name: pName })
      .execute();
  }

  //  we will make the product disabled using the active column
  async remove(pName: string) {
    return await this.productRepo.update(
      {
        name: pName,
      },
      {
        active: false,
      },
    );
  }
}
