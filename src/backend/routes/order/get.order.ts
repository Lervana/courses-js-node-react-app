import { Request, Response } from 'express'
import { param } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { getOrder } from '../../services/order.service'

export default {
    method: 'get',
    path: '/api/order/:id',
    validators: [authorize, param('id').not().isEmpty()],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () =>
                await getOrder({
                    id: req.params.id,
                }),
        }),
} as TRoute
