import { Request, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { updateOrder, TOrderData } from '../../services/order.service'

export default {
    method: 'patch',
    path: '/api/order',
    validators: [
        authorize,
        body('id').not().isEmpty(),
        body('tableNumber').not().isEmpty().isNumeric(),
        body('dishes').not().isEmpty().isObject(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: { uniqueConstraintFailed: 'Name must be unique.' },
            execute: async () => await updateOrder(req.body as TOrderData),
        }),
} as TRoute
