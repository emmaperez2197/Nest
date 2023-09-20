import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsString({ message: 'The name must be a string' })
  @MinLength(4, { message: 'Must be at least 4 characters' })
  name: string;
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;
}
