import { Request, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { updateDish, TDishData } from '../../services/dish.service'

export default {
    method: 'patch',
    path: '/api/dish',
    validators: [
        authorize,
        body('id').not().isEmpty(),
        body('name').not().isEmpty().isAlphanumeric(),
        body('price').not().isEmpty().isNumeric(),
        body('categoryId').not().isEmpty(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: { uniqueConstraintFailed: 'Name must be unique.' },
            execute: async () => await updateDish(req.body as TDishData),
        }),
} as TRoute
