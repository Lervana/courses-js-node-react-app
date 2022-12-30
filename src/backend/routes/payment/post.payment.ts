import { Request, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { createPayment, TPaymentData } from '../../services/payment.service'

export default {
    method: 'post',
    path: '/api/payment',
    validators: [
        authorize,
        body('orderId').not().isEmpty(),
        body('method').isIn(['CARD', 'CASH']).not().isEmpty(),
        body('amount').not().isEmpty().isNumeric(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () => await createPayment(req.body as TPaymentData),
        }),
} as TRoute
