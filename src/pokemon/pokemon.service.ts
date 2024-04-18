import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
      const pokemon = await this.PokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.manejarError(error);
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    //buscar por no
    if (!isNaN(+term)) {
      pokemon = await this.PokemonModel.findOne({ no: term });
    }

    //buscar por mongo id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.PokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.PokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }

    if (!pokemon)
      throw new NotFoundException(`No se encontro un pokemon con el id, name o no: ${term}`);


    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {

      const pokemon = await this.findOne(term);

      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON, ...updatePokemonDto };

    } catch (error) {
      this.manejarError(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const {deletedCount} = await this.PokemonModel.deleteOne({_id:id});
    if (deletedCount===0){
      throw new BadRequestException(`El ID ${id} no se encontro`);
    }
    return;
  }


  private manejarError(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Ya existe un registro con esa clave ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Hay un problema en el server, checar!`)
  }
}
