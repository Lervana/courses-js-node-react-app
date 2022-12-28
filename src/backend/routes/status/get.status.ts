import { RequestHandler } from 'express'

export const getStatus: RequestHandler = (req, res) => {
    res.send(`I'm alive!`)
}
