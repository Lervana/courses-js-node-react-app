import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { param } from 'express-validator'
import { deleteDish } from '../../services/dish.service'

export default {
    method: 'delete',
    path: '/api/dish/:id',
    validators: [authorize, param('id').not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () => await deleteDish({ id: req.params.id }),
        }),
} as TRoute
