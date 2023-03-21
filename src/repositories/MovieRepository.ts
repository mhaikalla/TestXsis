import {Op} from 'sequelize'
import {
  MovieFilter,
  Movies
} from '../models'; 

import { MoviesTable  } from '../db/sequelize/table';
import {QueryFilter} from '../models/QueryFilter'
export interface IMovieRepository {
  findById(id  :number): Promise<Movies | null>
  findAll(filter : MovieFilter): Promise<Movies[]> 
  create(movie : Movies) : Promise<Movies | null>
  delete(id : number) : Promise<boolean> 
  update(movie:Movies, id : number) : Promise<boolean>
}


export class MovieRepository implements IMovieRepository {

  findById = async (id :number): Promise<Movies | null> => {
    const result = await MoviesTable.findOne({
      where : {id}
    })
    if(!result) return null

    return result.get({plain : true})
  };
  findAll = async (filter : MovieFilter): Promise<Movies[]> => {
    const {keyword, page, limit} = filter
    const offset = limit * (page - 1) 
    const result = await  MoviesTable.findAll({
      where : {
        [Op.or] :{
          title :{ [Op.like] : keyword},
          description :{ [Op.like] : keyword},
        }
      },
      limit,
      offset
    })
    if(!result) return []

    return result.map(m => m.get({plain : true}))
  };
  create = async(movie : Movies) : Promise<Movies | null> => {
    try{
      const result = await MoviesTable.create(movie)
      return result.get({plain : true})
    }
    catch(ex)
    {
      
      return null
    }
  }
  update = async(movie:Movies, id : number) : Promise<boolean> => {
    try{
      await MoviesTable.update(movie, {where: {id}})
      return true 
    }
    catch(ex){
      return false
    }
  }
  delete = async(id : number) : Promise<boolean> => {
    try{
      await MoviesTable.destroy({where: {id}})
      return true
    }
    catch(ex){
      return false
    }
  }
}
