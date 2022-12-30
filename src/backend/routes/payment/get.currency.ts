import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import axios from 'axios'

import { TRoute } from '../types'
import { handleRequest, TCustomError } from '../../utils/request.utils'
import { prisma } from '../../database'

import {
    getCurrencyInfo,
    upsertCurrency,
    findCurrencyData,
    getCurrencyData,
} from '../../services/currency.service'
import { authorize } from '../../utils/middleware.utils'
import { param } from 'express-validator'

export default {
    method: 'get',
    path: '/api/payment/:amount/:currency',
    validators: [
        authorize,
        param('amount').not().isEmpty(),
        param('currency').not().isEmpty().isIn(['USD', 'EUR', 'GBP', 'JPY']),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () => {
                const { usd, eur, gbp, jpy } = await getCurrencyInfo()

                if (!usd || !eur || !gbp || !jpy) {
                    const { data } = await axios.get(
                        'http://api.nbp.pl/api/exchangerates/tables/C',
                    )

                    const usdData = findCurrencyData(data[0].rates, 'USD')
                    const eurData = findCurrencyData(data[0].rates, 'EUR')
                    const gbpData = findCurrencyData(data[0].rates, 'GBP')
                    const jpyData = findCurrencyData(data[0].rates, 'JPY')

                    const transactions = []
                    if (usdData) transactions.push(upsertCurrency(usdData))
                    if (eurData) transactions.push(upsertCurrency(eurData))
                    if (gbpData) transactions.push(upsertCurrency(gbpData))
                    if (jpyData) transactions.push(upsertCurrency(jpyData))

                    await prisma.$transaction([...transactions])
                }

                const amount = parseFloat(req.params.amount)
                const currency = req.params.currency
                const currencyData = await getCurrencyData(currency)

                if (!currencyData)
                    throw {
                        isCustomError: true,
                        message:
                            'Unable to get currency data, please try later',
                        status: StatusCodes.SERVICE_UNAVAILABLE,
                    } as TCustomError

                const currencyAmount = amount / currencyData.ask

                return {
                    exchange: {
                        INPUT: {
                            CURRENCY: 'PLN',
                            AMOUNT: amount.toFixed(2),
                        },
                        OUTPUT: {
                            CURRENCY: currency,
                            AMOUNT: currencyAmount.toFixed(
                                currency === 'JPY' ? 0 : 2,
                            ),
                        },
                    },
                }
            },
        }),
} as TRoute
