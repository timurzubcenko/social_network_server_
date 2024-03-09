import express from 'express'
const router = express.Router()
import * as PostController from '../controllers/PostController.js'
import checkAuth from "../utils/checkAuth.js";
import { postCreateValidation } from '../validations/auth.js'

router.post('/create', checkAuth, postCreateValidation, PostController.create)
router.get('/', PostController.getAll)
router.get('/:id', PostController.getOne)
router.delete('/:id', checkAuth, PostController.remove)
router.patch('/:id', PostController.update)
router.get('/user/:id', checkAuth, PostController.getUserPost)
router.get('/like/:id', checkAuth, PostController.like)

export default router;