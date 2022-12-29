import { prisma } from '../database'
import { v4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'
import { TCustomError } from '../utils/request.utils'
import { Decimal } from '@prisma/client/runtime'

export type TOrderData = {
    id: string
    tableNumber: number
    dishes: Record<string, number>
}

// Utils

const getDishPrice = (count: number, price?: Decimal) =>
    parseFloat(price?.toString() ?? '') * count

const createOrderDish = async (
    orderId: string,
    dishId: string,
    count: number,
) => {
    const dish = await prisma.dish.findFirst({
        where: { id: dishId },
    })

    return {
        promise: prisma.orderDish.create({
            data: {
                id: v4(),
                order: { connect: { id: orderId } },
                dish: { connect: { id: dishId } },
                count,
                price: dish?.price ?? 0,
            },
        }),
        dishTotalPrice: getDishPrice(count, dish?.price),
    }
}

const createOrderDishes = async (
    orderId: string,
    dishes: TOrderData['dishes'],
) => {
    const transactions = []
    let totalPrice = 0

    for (const dishId in dishes) {
        const { promise, dishTotalPrice } = await createOrderDish(
            orderId,
            dishId,
            dishes[dishId],
        )
        totalPrice += dishTotalPrice
        transactions.push(promise)
    }

    return {
        transactions,
        totalPrice,
    }
}

// Services

const checkIfTableBooked = async (id: string, tableNumber: number) => {
    const order = await prisma.order.findFirst({
        where: {
            NOT: [{ id }],
            closedAt: null,
            tableNumber,
        },
    })

    if (order && id !== order.id)
        throw {
            isCustomError: true,
            message: 'Table is in use',
            status: StatusCodes.BAD_REQUEST,
        } as TCustomError
}

const checkIfOrderClosed = async (id: string) => {
    const order = await prisma.order.findFirst({ where: { id } })

    if (!order || order.closedAt)
        throw {
            isCustomError: true,
            message: order?.closedAt
                ? 'Order closed and cannot be modified'
                : 'Invalid order id',
            status: StatusCodes.BAD_REQUEST,
        } as TCustomError

    return order
}

export const createOrder = async ({
    tableNumber,
    dishes,
}: Omit<TOrderData, 'id'>) => {
    const orderId = v4()

    await checkIfTableBooked(orderId, tableNumber)

    const { transactions, totalPrice } = await createOrderDishes(
        orderId,
        dishes,
    )

    const [createdOrder, ...createdDishes] = await prisma.$transaction([
        prisma.order.create({
            data: { id: orderId, tableNumber, totalPrice },
        }),
        ...transactions,
    ])

    return {
        order: createdOrder,
        orderDishes: createdDishes,
    }
}

export const updateOrder = async ({
    id: orderId,
    tableNumber,
    dishes,
}: TOrderData) => {
    await checkIfTableBooked(orderId, tableNumber)
    const order = await checkIfOrderClosed(orderId)

    if (order?.tableNumber !== tableNumber) {
        await prisma.order.update({
            where: { id: orderId },
            data: { tableNumber },
        })
    }

    const oldDishesMap: Record<string, number> = {}
    const oldDishes = await prisma.orderDish.findMany({ where: { orderId } })
    oldDishes.forEach((od) => (oldDishesMap[od.dishId] = od.count))

    if (JSON.stringify(oldDishesMap) !== JSON.stringify(dishes)) {
        // Dishes need update

        const { transactions, totalPrice } = await createOrderDishes(
            orderId,
            dishes,
        )

        const [deleted, order, updated] = await prisma.$transaction([
            prisma.orderDish.deleteMany({ where: { orderId } }),
            prisma.order.update({
                where: { id: orderId },
                data: { totalPrice },
            }),
            ...transactions,
        ])

        return {
            order,
            updated,
            deleted,
        }
    }

    return await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            OrderDish: true,
            Payment: true,
        },
    })
}

export const getOrder = async ({ id }: { id: string }) =>
    await prisma.order.findFirst({
        where: {
            id,
        },
        include: {
            OrderDish: true,
            Payment: true,
        },
    })

export const getOrders = async () =>
    await prisma.order.findMany({
        include: {
            OrderDish: true,
            Payment: true,
        },
    })

export const deleteOrder = async ({ id }: { id: string }) =>
    await prisma.$transaction([
        prisma.payment.deleteMany({
            where: { orderId: id },
        }),
        prisma.orderDish.deleteMany({
            where: { orderId: id },
        }),
        prisma.order.delete({
            where: { id },
        }),
    ])
