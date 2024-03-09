import express from "express";
import connectDB from "./config/db.js"
import multer from "multer";
import cors from 'cors'

import checkAuth from "./utils/checkAuth.js";

connectDB()
const app = express()

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})
const upload = multer({ storage })

const PORT = 8000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ extended: false }))
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => { res.send('Hello, World!') })

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

import auth from './routes/auth.routes.js'
app.use('/auth', auth)

import post from './routes/post.routes.js'
app.use('/posts', post)

import user from './routes/user.routes.js'
app.use('/users', user)

app.listen(PORT, () => { console.log('App listen on port: ' + PORT) })