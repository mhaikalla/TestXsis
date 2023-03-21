import BaseRoutes from "../BaseRoutes";
import { MovieService } from "../../services/MovieService";
import { MovieController } from "../../controllers/MovieController";
import { MovieRoutes } from "./MovieRoutes";
import { MovieRepository } from "../../repositories/MovieRepository";


//Menu CRM total
const movieRepository = new MovieRepository();
const movieService = new MovieService(movieRepository);
const movieController = new MovieController(movieService);
const movieRoutes = new MovieRoutes(movieController);
movieRoutes.routes();
//End menu CRM total

export class ApiV1 extends BaseRoutes {
    constructor() {
        super()
    }

    public routes(): void {
        this.router.use('/movies', movieRoutes.router)
    }
}
