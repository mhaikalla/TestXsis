import BaseRoutes from "../BaseRoutes";
import validate from "../../middlewares/ValidatorMiddleware";
import { createMovieValidator, MovieValidator } from "../../validations/MovieValidator";
import { MovieController } from "../../controllers/MovieController";

export class MovieRoutes extends BaseRoutes {
  private _movieController: MovieController;

  constructor(movieController: MovieController) {
    super();
    this._movieController = movieController;
  }

  public routes(): void {
    this.router.get('/:id', validate(MovieValidator), this._movieController.findAllMovie);
    // this.router.get('/:id', this._movieController.findMovieById);
    // this.router.put('/:id', this._movieController.update);
    // this.router.delete('/:id', this._movieController.delete);
    // this.router.post('/create', this._movieController.create);
  }
}
