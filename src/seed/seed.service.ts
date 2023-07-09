import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';



@Injectable()
export class SeedService {

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  private readonly axios : AxiosInstance = axios;

  async executeSEED() {

    await this.pokemonModel.deleteMany({});

    const insertPokemons : {name: string, no: number}[] = [];

    const {data} = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=200`)

    data.results.forEach( async ({name, url}) => {

      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      insertPokemons.push({name, no});
    });
  
    await this.pokemonModel.insertMany(insertPokemons);
    
    return 'SEED executed';
  }


}
