import { Request, Response, NextFunction } from 'express';
import { ControllerBase } from './ControllerBase';
import { IMovieService } from '../services/MovieService';

import { Movies, MovieFilter } from '../models';
import { QueryFilterParam } from '../models/QueryFilter';
export class MovieController extends ControllerBase {
  private _movieService: IMovieService;

  constructor(movieService: IMovieService) {
    super();
    this._movieService = movieService;
  }

  findById = async (req: Request, res: Response, next: NextFunction) => {
    const params = req.params;
    const id = Number(params.id)
    try {
      const result = await this._movieService.findMovieById(id)
      if(!result)
      {
        return this.NotFound(res, "Data Tidak Ditemukan")
      }
      else{
        return this.ok(res, result);
      }
    } catch (error) {
     
      return next(error);
    }
  };
  findAll = async (req: Request<any, any, any, QueryFilterParam<MovieFilter>>, res: Response, next: NextFunction) => {
    
    try {
      const params = req.query;
      const filter = new MovieFilter(
        req.query,
        params.title,
        params.desciption,
        Number(params.rating),
        Number(params.rating_from),
        Number(params.rating_to)
      );
      const result = await this._movieService.findAllMovie(filter)
      if(!result)
      {
        return this.NotFound(res, "Data Tidak Ditemukan")
      }
      else{
        return this.ok(res, result);
      }
    } catch (error) {
     
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    const bodyJson = req.body;
    try {
      const result = await this._movieService.create(bodyJson)
      if(!result)
      {
        return this.NotFound(res, "Data Tidak Ditemukan")
      }
      else{
        return this.created(res, result, "Data telah diinput");
      }
    } catch (error) {
     
      return next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    const bodyJson = req.body;
    const id = Number(req.params.id);
    try {
      const result = await this._movieService.update(bodyJson, id)
      if(!result)
      {
        return this.NotFound(res, "Data Tidak Ditemukan")
      }
      else{
        return this.ok(res, result, "Data telah diupdate");
      }
    } catch (error) {
     
      return next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    try {
      const result = await this._movieService.delete(id)
      if(result[1] === 404)
      {
        return this.NotFound(res, "Data Tidak Ditemukan")
      }
      else{
        return this.ok(res, result, "Data telah dihapus");
      }
    } catch (error) {
     
      return next(error);
    }
  };
}
