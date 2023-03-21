import { Request, Response, NextFunction } from "express"
import { validationResult, ValidationChain } from "express-validator"
import { ResponseBuilder } from "../utils/ApiJsonResponse"

const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            param: error.param,
            message: error.msg,
        };
    }
});

const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = myValidationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const badRequestResponse = ResponseBuilder.badRequest("ValidationError", errors.array(), "Validation error")
        return res.status(400).send(badRequestResponse)
    };
};

export default validate