import {Router} from "express"

abstract class BaseRoutes {
    public router: Router;

    constructor() {
        this.router = Router()
    }

    abstract routes(): void
}

export default BaseRoutes