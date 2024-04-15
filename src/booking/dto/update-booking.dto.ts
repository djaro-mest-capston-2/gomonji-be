import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateBookingDto {
  @IsUUID()
  @IsOptional()
  tripId?: string;

  @IsUUID()
  @IsOptional()
  billId?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNo?: string;
}
