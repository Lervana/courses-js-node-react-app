import { prisma } from '../database'
import { v4 } from 'uuid'

export type TDishData = {
    id: string
    name: string
    price: number
    description?: string
    categoryId: string
}

export const createDish = async ({
    name,
    price,
    description,
    categoryId,
}: Omit<TDishData, 'id'>) => {
    return prisma.dish.create({
        data: {
            id: v4(),
            name,
            price,
            description,
            categoryId,
        },
    })
}

export const updateDish = async ({
    id,
    name,
    price,
    description,
    categoryId,
}: TDishData) =>
    await prisma.dish.update({
        data: {
            name,
            price,
            description,
            categoryId,
        },
        where: {
            id,
        },
    })

export const getDishes = async () => await prisma.dish.findMany()

export const deleteDish = async ({ id }: { id: string }) =>
    await prisma.dish.delete({
        where: {
            id,
        },
    })
