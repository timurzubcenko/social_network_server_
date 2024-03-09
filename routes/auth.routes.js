import express from 'express'
const router = express.Router()
import { registerValidation, loginValidation } from '../validations/auth.js'
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config();

import User from "../models/User.js";
import checkAuth from "../utils/checkAuth.js";
import handleValidationErrors from '../utils/handleValidationErrors.js';

router.post('/register', handleValidationErrors, registerValidation, async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const doc = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            },
        )

        res.json({
            ...user._doc,
            token
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось зарегестрироваться'
        })
    }
})

router.post('/login', handleValidationErrors, loginValidation, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(400).json({ message: 'Неверный логин или пароль' })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            },
        )

        res.json({
            ...user._doc,
            token
        })

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось авторизоваться'
        })
    }
})

router.get('/me', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        // res.json({
        //     success: true
        // })
        res.json(user._doc)
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Нет доступа'
        })
    }
})

export default router;