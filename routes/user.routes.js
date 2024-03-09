import express from 'express'
const router = express.Router()
import * as UserController from '../controllers/UserController.js'
import checkAuth from "../utils/checkAuth.js";

router.get('/', UserController.getAll)
router.get('/users/:id', checkAuth, UserController.getOne)
router.patch('/userupdate/:id', checkAuth, UserController.update)

export default router;