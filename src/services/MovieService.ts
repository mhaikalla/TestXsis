import { MovieFilter, Movies } from '../models/index';
import { IMovieRepository } from '../repositories/MovieRepository'
import {QueryFilter} from '../models/QueryFilter'

export interface IMovieService {
  findAllMovie(filter : MovieFilter): Promise<Movies[]>
  findMovieById(id :number): Promise<Movies | null>
  create(movie :Movies): Promise<Movies | null>
  update(movie: Movies, id : number): Promise<[Movies | null, number]>
  delete(id : number): Promise<[Movies | null, number]>
}

export class MovieService implements IMovieService {
  private _movieRepository: IMovieRepository;
  
  constructor(
    movieRepository: IMovieRepository,
  ) {
    this._movieRepository = movieRepository
  }

  findAllMovie = async (filter : MovieFilter): Promise<Movies[]> => {
    const result = this._movieRepository.findAll(filter)
    return result
  }

  findMovieById = async (id :number): Promise<Movies | null> => {
    const result = this._movieRepository.findById(id)
    return result
  }
  create = async (movie :Movies): Promise<Movies | null> => {
    const result = this._movieRepository.create(movie)
    return result
  }

  update = async (movie: Movies, id : number): Promise<[Movies | null, number]> => {
    let currentData = await this._movieRepository.findById(id)
    if(!currentData)
    {
      return [null, 404]
    }
    else{
      currentData = {...movie}
      const result = await this._movieRepository.update(currentData, id)
      return result ? [currentData, 200] : [null, 500]
    }
  }
  delete = async (id : number): Promise<[Movies | null, number]> => {
    let currentData = await this._movieRepository.findById(id)
    if(!currentData)
    {
      return [null, 404]
    }
    else{
      const result = await this._movieRepository.delete(id)
      return result ? [currentData, 200] : [null, 500]
    }
  }
}
