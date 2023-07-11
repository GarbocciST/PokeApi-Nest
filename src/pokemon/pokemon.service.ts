import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,

    

  ){
    
    this.defaultLimit = configService.get<number>('defaultLimit');

  }


  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );

      return pokemon;
    } catch (error) {

      this.handleException(error, 'create');

    }

  }

  async findAll(paginationDto : PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find().limit(limit).skip(offset).sort({ no: 1 }).select('-__v') ;
  }

  async findOne(term: string) {
    
    let pokemon : Pokemon;
    
    if ( !isNaN( +term )) pokemon = await this.pokemonModel.findOne({ no: term});

    // Mongo
    if ( !pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);

    // Name 
    if (!pokemon ) pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });

    if ( !pokemon ) throw new BadRequestException(`Invalid term ${term}`) 

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const pokemon = await this.findOne(term);
    
      if( updatePokemonDto.name ) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
  
      await pokemon.updateOne( updatePokemonDto, {new: true} )
      
      return {...pokemon.toJSON(), ...updatePokemonDto} ;

    } catch (error) {
      this.handleException(error, 'update');
    }
  }

  async remove(id: string) {
    // const pokemon  = await this.findOne(id);
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount, acknowledged} = await this.pokemonModel.deleteOne({ _id: id });

    if ( deletedCount === 0 ) throw new BadRequestException(`Invalid id ${id}`)

    return 'ok';  
  }


  private handleException(error: any, message: string) {
    if (error.code === 11000) throw new BadRequestException(`Pokemon already exists ${ JSON.stringify(error.keyValue) }`);
      
    throw new InternalServerErrorException(`Can't ${message} pokemon - Check server logs`);
  }

}
