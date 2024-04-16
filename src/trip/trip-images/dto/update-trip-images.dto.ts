import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateTripImagesDto {
  @IsNotEmpty()
  @IsString()
  urls: string[];
}
