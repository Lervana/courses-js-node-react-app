import express from 'express'

import getStatus from './status/get.status'
import postUser from './user/post.user'
import loginUser from './user/login.user'
import getCategories from './category/get.categories'
import postCategory from './category/post.category'
import deleteCategory from './category/delete.category'
import getDishes from './dish/get.dishes'
import postDish from './dish/post.dish'
import patchDish from './dish/patch.dish'
import deleteDish from './dish/delete.dish'
import postOrder from './order/post.order'
import patchOrder from './order/patch.order'
import getOrder from './order/get.order'
import deleteOrder from './order/delete.order'
import getOrders from './order/get.orders'
import postPayment from './payment/post.payment'
import getPayment from './payment/get.payment'
import getCurrency from './payment/get.currency'
import getOrdersByDate from './order/get.orders.byDate'

const router = express.Router()

// home page route
router.get('/', (req, res) => {
    res.send('Example home page')
})

// api routes
const apiRoutes = [
    getStatus,
    postUser,
    loginUser,
    getCategories,
    postCategory,
    deleteCategory,
    getDishes,
    postDish,
    patchDish,
    deleteDish,
    postOrder,
    patchOrder,
    getOrder,
    getOrders,
    getOrdersByDate,
    deleteOrder,
    postPayment,
    getPayment,
    getCurrency,
]

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
)

export default router
