import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios'
import { PokeInterface } from './interface/poke-response-interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
  ) { }
  private readonly axios: AxiosInstance = axios;

  async ejecutarSeed() {

    await this.pokemonService.RemoveAllData();

    const { data } = await this.axios.get<PokeInterface>('https://pokeapi.co/api/v2/pokemon?limit=600');
    const DataToInsert: CreatePokemonDto[] = [];

    data.results.forEach(({ name, url }) => {
      const segmento = url.split('/');
      const no = +segmento[segmento.length - 2];
      //console.log({ name, no });
      DataToInsert.push({ name, no });
    })

    await this.pokemonService.cargarDatos(DataToInsert)
    return "Seed ejecutados";
  }
}
