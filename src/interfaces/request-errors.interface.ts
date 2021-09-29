import { ApiProperty } from '@nestjs/swagger';

export class RequestErrorInterface {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: Array<string>;

  @ApiProperty()
  error: string;
}
