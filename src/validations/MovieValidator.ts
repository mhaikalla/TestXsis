import { query } from "express"
import { body, param } from "express-validator"

export const createMovieValidator = [
    body('title')
        .not().isEmpty().withMessage('title harus diisi'),
    body('description')
        .not().isEmpty().withMessage('title harus diisi'),
    body('rating')
        .not().isEmpty().withMessage('rating harus diisi')
        .isNumeric().withMessage('Masukan rating berupa angka atau desimal'),
]