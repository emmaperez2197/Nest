import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?offset=200&limit=2',
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
}
