import { body, param } from "express-validator"

export const createMovieValidator = [
    body('title')
        .not().isEmpty().withMessage('title harus diisi'),
    body('description')
        .not().isEmpty().withMessage('title harus diisi'),
    body('rating')
        .not().isEmpty().withMessage('rating harus diisi')
        .isNumeric().withMessage('Masukan rating berupa angka atau desimal')
        .isInt({min : 0, max : 10.0}).withMessage('Masukan rating 1 - 10'),
]
// param('id')
// .not().isEmpty().withMessage('id harus diisi')
// .isNumeric().withMessage('Masukan id berupa angka')
export const movieValidator = [
    body('rating').optional({ nullable: true })
        .isNumeric().withMessage('Masukan rating hanya berupa angka atau desimal')
        .isInt({min : 0, max : 10.0}).withMessage('Masukan rating 1 - 10'),
    body('rating_from').optional({ nullable: true })
        .isNumeric().withMessage('Masukan rating hanya berupa angka atau desimal')
        .isInt({min : 0, max : 10.0}).withMessage('Masukan rating 1 - 10'),
    body('rating_to').optional({ nullable: true })
        .isNumeric().withMessage('Masukan rating hanya berupa angka atau desimal')
        .isInt({min : 0, max : 10.0}).withMessage('Masukan rating 1 - 10'),
]

export const getMovieValidator = [
    param('id').optional({ nullable: true }).isNumeric().withMessage('Masukan Id hanya berupa numeric'),
]