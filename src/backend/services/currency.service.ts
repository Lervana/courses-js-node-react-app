import { prisma } from '../database'
import { v4 } from 'uuid'

const getCondition = () => {
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    return {
        gte: startDate,
        lte: new Date(),
    }
}

export const getCurrencyInfo = async () => {
    const [usd, eur, gbp, jpy] = await prisma.$transaction([
        prisma.currency.findFirst({
            where: { code: 'USD', createdAt: getCondition() },
        }),
        prisma.currency.findFirst({
            where: { code: 'EUR', createdAt: getCondition() },
        }),
        prisma.currency.findFirst({
            where: { code: 'GBP', createdAt: getCondition() },
        }),
        prisma.currency.findFirst({
            where: { code: 'JPY', createdAt: getCondition() },
        }),
    ])

    return {
        usd,
        eur,
        gbp,
        jpy,
    }
}

export const upsertCurrency = ({
    code,
    bid,
    ask,
    currency,
}: {
    code: string
    bid: number
    ask: number
    currency: string
}) =>
    prisma.currency.upsert({
        where: { code },
        create: {
            id: v4(),
            code: code,
            bid,
            ask,
            currency,
        },
        update: {
            bid,
            ask,
            currency,
        },
    })

export const findCurrencyData = (
    rates: { currency: string; code: string; bid: number; ask: number }[],
    code: string,
) => rates.find((rate) => rate.code === code)

export const getCurrencyData = async (code: string) =>
    await prisma.currency.findFirst({
        where: { code },
    })
