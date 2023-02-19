import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

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

    try {
      return await this.productRepo.insert(createProduct);
    } catch (err) {
      console.log(`Error while creating new user is ${err}`);
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      return await this.productRepo.find({
        select: {
          name: true,
          price: true,
          description: true,
        },
      });
    } catch (err: any) {
      throw new HttpException(`{err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByName(pName: string, currency?: string) {
    const lCurrency = typeof currency === 'undefined' ? 'USD' : currency;
    const retProd = await this.productRepo.findOne({
      select: {
        name: true,
        price: true,
        description: true,
      },
      where: {
        name: pName,
        active: true,
      },
    });

    if (retProd == null) {
      throw new HttpException(
        `Product with name ${pName} not found!!!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (lCurrency !== 'USD') {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          apikey: '880IX9uh6RPMqCVKDJO6SFucwISJz3iB',
        },
        params: {
          from: 'USD',
          to: lCurrency,
          amount: retProd.price,
        },
      };

      const price = await firstValueFrom(
        this.httpService.get(
          'https://api.apilayer.com/currency_data/convert',
          requestConfig,
        ),
      );

      // lets print the price first
      retProd.price = price.data['result'];
    }
    this.increaseViewCount(pName);
    return retProd;
  }

  async listMostViewedProduct(count?: number) {
    let resCount = 5;
    if (typeof count !== 'undefined') {
      resCount = count;
    }
    return await this.productRepo.find({
      select: {
        name: true,
        price: true,
        description: true,
      },
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
