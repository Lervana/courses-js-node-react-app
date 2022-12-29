import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { getCategories } from '../../services/category.service'
export default {
    method: 'get',
    path: '/api/category',
    validators: [],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () => await getCategories(),
        }),
} as TRoute
