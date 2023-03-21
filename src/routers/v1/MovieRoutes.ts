import BaseRoutes from "../BaseRoutes";
import validate from "../../middlewares/ValidatorMiddleware";
import { createMovieValidator, getMovieValidator, movieValidator } from "../../validations/MovieValidator";
import { MovieController } from "../../controllers/MovieController";

export class MovieRoutes extends BaseRoutes {
  private _movieController: MovieController;

  constructor(movieController: MovieController) {
    super();
    this._movieController = movieController;
  }

  public routes(): void {
    this.router.get('/', validate(movieValidator), this._movieController.findAll);
    this.router.get('/:id', validate(getMovieValidator), this._movieController.findById);
    this.router.put('/:id', validate(createMovieValidator), validate(getMovieValidator), this._movieController.update);
    this.router.delete('/:id', validate(getMovieValidator),this._movieController.delete);
    this.router.post('/create',validate(createMovieValidator), this._movieController.create);
  }
}
