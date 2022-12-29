import { prisma } from '../database'
import { v4 } from 'uuid'

export const createCategory = async ({ name }: { name: string }) => {
    return await prisma.category.create({
        data: {
            id: v4(),
            name,
        },
    })
}

export const getCategories = async () => await prisma.category.findMany()

export const deleteCategory = async ({ id }: { id: string }) =>
    await prisma.category.delete({
        where: {
            id,
        },
    })
