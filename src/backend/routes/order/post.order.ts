import { Request, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { createOrder, TOrderData } from '../../services/order.service'

export default {
    method: 'post',
    path: '/api/order',
    validators: [
        authorize,
        body('tableNumber').not().isEmpty().isNumeric(),
        body('dishes').not().isEmpty().isObject(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () =>
                await createOrder(req.body as Omit<TOrderData, 'id'>),
        }),
} as TRoute
