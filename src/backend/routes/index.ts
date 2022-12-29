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
]

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
)

export default router
