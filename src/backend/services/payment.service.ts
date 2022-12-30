import { prisma } from '../database'
import { v4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'
import { TCustomError } from '../utils/request.utils'

export type TPaymentData = {
    id: string
    orderId: string
    method: 'CASH' | 'CARD'
    amount: number
}

export const createPayment = async ({
    orderId,
    method,
    amount,
}: Omit<TPaymentData, 'id'>) => {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: { Payment: true },
    })

    if (!order || order.closedAt)
        throw {
            isCustomError: true,
            message: order?.closedAt
                ? 'Order closed, nothing to pay'
                : 'Invalid order id',
            status: StatusCodes.BAD_REQUEST,
        } as TCustomError

    const payments = await prisma.payment.findMany({ where: { orderId } })
    const paymentsSum =
        payments.length === 0
            ? 0
            : payments
                  .map((payment) => payment.amount)
                  .reduce((prev, current) => prev + current)

    const currentBalance = order.totalPrice - paymentsSum
    const payment = amount >= currentBalance ? currentBalance : amount
    const orderBalance = currentBalance - payment

    const [createdPayment, updatedOrder] = await prisma.$transaction([
        prisma.payment.create({
            data: {
                id: v4(),
                amount: payment,
                method,
                orderId,
            },
        }),

        prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                closedAt: orderBalance < 0.01 ? new Date() : null,
            },
        }),
    ])

    return {
        order: updatedOrder,
        payment: createdPayment.amount.toFixed(2),
        rest: (amount - payment).toFixed(2),
        orderBalance: orderBalance.toFixed(2),
    }
}

export const getPayments = async () => await prisma.payment.findMany()
