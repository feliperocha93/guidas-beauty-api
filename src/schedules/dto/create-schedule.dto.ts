import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateScheduleDto {
  @IsDate()
  @IsNotEmpty()
  schedule: Date;

  @IsInt()
  @IsNotEmpty()
  addressId: number;

  @IsBoolean()
  reserved?: boolean;
  //if this value to be true, field bookingDate should be required

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  userId?: number;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  bookingDate?: Date;
  //rules:
  //this property only can be value if property reserved is be true
  //this value can not be after schedule property value
  //if property reserved is changed to false, this value should back to be null

  @IsOptional()
  @IsBoolean()
  accomplished?: boolean;
  //rules: This value only can be true if schedule Date is past
}
