import express from 'express'

export type TServerConfig = {
    port: number
}

export const startServer = ({ port }: TServerConfig) => {
    const app = express()

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
