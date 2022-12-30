import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { getPayments } from '../../services/payment.service'

export default {
    method: 'get',
    path: '/api/payment',
    validators: [],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () => await getPayments(),
        }),
} as TRoute
