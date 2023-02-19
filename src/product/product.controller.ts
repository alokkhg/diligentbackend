import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('mostviewed/:count?')
  mostViewed(@Param('count') count: number) {
    return this.productService.listMostViewedProduct(count);
  }

  @Get(':name/:currency?')
  findOne(@Param('name') name: string, @Param('currency') currency: string) {
    return this.productService.findOneByName(name, currency);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.productService.remove(name);
  }
}
