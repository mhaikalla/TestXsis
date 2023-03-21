import { ResponseBuilder } from "../utils/ApiJsonResponse";
import { Response } from "express";

export class ControllerBase {
    ok<T>(res: Response, data?: T, messageStatus? : string) {
        const response = ResponseBuilder.ok<T>(data)
        return res.status(response.code).send(response)
    }

    created<T>(res: Response, data?: T) {
        const response = ResponseBuilder.created<T>(data)
        return res.status(response.code).send(response)
    }
    
    internalServerError<T>(res: Response, message?: string, errors?: T) {
        const response = ResponseBuilder.internalServerError<T>(message, errors)
        return res.status(response.errorCode).send(response)
    }

    badRequest<T>(res: Response, message?: string, errors?: T) {
        const response = ResponseBuilder.badRequest(errors, message)
        return res.status(response.errorCode).send(response)
    }

    NotFound<T>(res: Response, message?: string) {
        const response = ResponseBuilder.notFound(message)
        return res.status(response.errorCode).send(response)
    }
}