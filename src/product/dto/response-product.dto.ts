import { Exclude } from '@nestjs/class-transformer';

export class ResponseProductDto {
  name: string;
  description?: string;
  price: number;
  @Exclude()
  id: number;
  @Exclude()
  view_count: number;
  @Exclude()
  active: boolean;
}
