import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { async } from 'rxjs';

jest.setTimeout(60000);
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World Test Nest!');
  });

  it('/get_all', () => {
    return request(app.getHttpServer()).get('/product').expect(200);
  });

  it('get a single product by name', () => {
    return request(app.getHttpServer())
      .get('/product/product_2')
      .expect(200)
      .expect({
        name: 'product_2',
        description: null,
        price: 300,
      });
  });

  it('List the most viewed pproducts and it should b 5', async () => {
    const response = await request(app.getHttpServer()).get(
      '/product/mostviewed/',
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  it('List the most viewed pproducts with 2 entries', async () => {
    const response = await request(app.getHttpServer()).get(
      '/product/mostviewed/2',
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('create a new product', async () => {
    const payload = {
      name: 'test_product',
      price: '200',
      description: 'This is a test product',
    };

    await request(app.getHttpServer())
      .post(`/product`)
      .set('Accept', 'application/json')
      .send(payload)
      .expect(201);
  });

  it('chck the created Product', async () => {
    await request(app.getHttpServer())
      .get('/product/test_product')
      .expect(200)
      .expect({
        name: 'test_product',
        price: 200,
        description: 'This is a test product',
      });
  });

  it('check for deletion of product', async () => {
    await request(app.getHttpServer()).del('/product/test_product').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
