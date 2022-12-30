import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { param } from 'express-validator'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { getOrders } from '../../services/order.service'

export default {
    method: 'get',
    path: '/api/order/:from/:to',
    validators: [
        authorize,
        param('from').not().isEmpty().isDate(),
        param('to').not().isEmpty().isDate(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () =>
                await getOrders({
                    gte: new Date(req.params.from),
                    lte: new Date(req.params.to),
                }),
        }),
} as TRoute
