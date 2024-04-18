import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios'
import { PokeInterface } from './interface/poke-response-interface';

@Injectable()
export class SeedService {
private readonly axios: AxiosInstance = axios;

 async  ejecutarSeed(){
    const {data}= await this.axios.get<PokeInterface>('https://pokeapi.co/api/v2/pokemon?limit=2');

    data.results.forEach(({name, url})=>{
      const  segmento = url.split('/');
      const no = +segmento[ segmento.length-2 ];
      console.log({name, no})
    })

    return data.results;
  }
}
