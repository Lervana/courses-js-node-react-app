import { RequestHandler } from 'express'
import { v4 } from 'uuid'
import crypto from 'crypto'
import { prisma } from '../../database'
import { checkPrismaError } from '../../utils'
import { StatusCodes } from 'http-status-codes'

const SALT = (process.env.PASSWORD_SALT as string) ?? 'XYZ'

export const postUser: RequestHandler = async (req, res) => {
    const { email, name, password } = req.body

    const hash = crypto.createHmac('sha512', SALT)
    hash.update(password)
    const passwordHash = hash.digest('hex')

    try {
        const createdUser = await prisma.user.create({
            data: {
                id: v4(),
                name,
                email,
                password: passwordHash,
            },
        })

        res.status(StatusCodes.CREATED)
        res.send({ ...createdUser, password: '***' })
    } catch (err) {
        console.error(err)
        const response = checkPrismaError(err, {
            uniqueConstraintFailed: 'Email must be unique.',
        })
        res.status(response.status)
        res.send(response.message)
    }
}
