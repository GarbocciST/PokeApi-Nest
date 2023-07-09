import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Pokemon, PokemonSchema } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    PokemonModule,
  ],
})
export class SeedModule {}

