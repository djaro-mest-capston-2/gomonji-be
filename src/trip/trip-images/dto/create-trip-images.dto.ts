import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTripImagesDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsNotEmpty()
  @IsString()
  urls: string[];
}
