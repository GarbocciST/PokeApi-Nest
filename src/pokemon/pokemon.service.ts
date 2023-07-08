import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>

  ){}


  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );

      return pokemon;
    } catch (error) {

      if (error.code === 11000) throw new BadRequestException(`Pokemon already exists ${ JSON.stringify(error.keyValue) }`);
      
      throw new InternalServerErrorException(`Can't create pokemon - Check server logs`);

    }

  }

  async findAll() {
    return 
  }

  async findOne(term: string) {
    
    let pokemon : Pokemon;
    
    if ( !isNaN( +term ) ) {
      pokemon = await this.pokemonModel.findOne({ no: term});
    } 

    // Mongo
    if ( !pokemon && isValidObjectId(term) ) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Name 
    if (!pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }

    if ( !pokemon ) {
      throw new BadRequestException(`Invalid term ${term}`)
    }

    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  async remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
