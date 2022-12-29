import { Request, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { createCategory } from '../../services/category.service'

export default {
    method: 'post',
    path: '/api/category',
    validators: [authorize, body('name').not().isEmpty().isAlphanumeric()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: { uniqueConstraintFailed: 'Email must be unique.' },
            execute: async () => createCategory(req.body),
        }),
} as TRoute
