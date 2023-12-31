import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    try {
      const createdPokemon = await this.PokemonModel.create(createPokemonDto);
      return createdPokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokémon with the NAME: ${JSON.stringify(
            error.keyValue.name,
          )} and the NUMBER: ${JSON.stringify(
            error.keyPattern.name,
          )} already exist in the database  `,
        );
      }
      console.log(error);
      throw new InternalServerErrorException('check logs');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.PokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1,
      })
      .select('-__v');
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`The ID: ${id} no is valid`);
    }
    try {
      const pokemon = await this.PokemonModel.findById({ _id: id });
      if (!pokemon) {
        throw new NotFoundException(`
        pokemon was not found with the id: ${id}`);
      }
      return pokemon;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(id);

      return (
        (await pokemon.updateOne(updatePokemonDto)) && {
          ...pokemon.toJSON(),
          ...updatePokemonDto,
        }
      );
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.PokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`pokemon no exist in db`);
    }
    return { messages: 'Successfully removed' };
  }

  private handlerErrors(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        'name or number already exists in the database',
      );
    }
    console.log(error);
    throw new InternalServerErrorException('check logs');
  }
}
