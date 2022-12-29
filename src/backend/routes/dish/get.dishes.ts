import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { getDishes } from '../../services/dish.service'

export default {
    method: 'get',
    path: '/api/dish',
    validators: [],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () => await getDishes(),
        }),
} as TRoute
