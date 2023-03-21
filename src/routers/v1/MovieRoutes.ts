import BaseRoutes from "../BaseRoutes";
import validate from "../../middlewares/ValidatorMiddleware";
import { createMovieValidator, movieValidator } from "../../validations/MovieValidator";
import { MovieController } from "../../controllers/MovieController";

export class MovieRoutes extends BaseRoutes {
  private _movieController: MovieController;

  constructor(movieController: MovieController) {
    super();
    this._movieController = movieController;
  }

  public routes(): void {
    this.router.get('/', validate(movieValidator), this._movieController.findAll);
    this.router.get('/:id', this._movieController.findById);
    this.router.put('/:id', this._movieController.update);
    this.router.delete('/:id', this._movieController.delete);
    this.router.post('/create',validate(createMovieValidator), this._movieController.create);
  }
}
