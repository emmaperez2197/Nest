import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import {
  InsertPokemons,
  PokeResponse,
} from './interfaces/poke-response.interface';
import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?offset=200&limit=300',
    );

    const dataFormatted = data.results.map(({ name, url }) => {
      const segments = url.split('/');

      return {
        name,
        no: +segments.at(-2),
      };
    });
    return dataFormatted;
  }

  async insertSeed() {
    await this.PokemonModel.deleteMany({});
    const pokemons = await this.executeSeed();

    const insertPokemons: InsertPokemons[] =
      await this.PokemonModel.insertMany(pokemons);

    return insertPokemons;
  }
}
