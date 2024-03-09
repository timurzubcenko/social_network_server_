import User from "../models/User.js";
import Post from "../models/Post.js";

export const getAll = async (req, res) => {
    try {

        const user = await User.find()

        res.json(user)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось получить посты'
        })
    }
}

export const getOne = async (req, res) => {
    try {

        const userId = req.params.id

        const user = await User.findById(userId)

        res.json(user)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось найти пользователя'
        })
    }
}

export const update = async (req, res) => {
    try {

        const userId = req.params.id
        const authUserId = req.userId

        if (String(userId) === String(authUserId)) {
            await User.updateOne(
                {
                    _id: authUserId
                },
                {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    avatarUrl: req.body.avatarUrl
                },
            )
            await Post.updateMany(
                {
                    user: authUserId
                },
                {
                    userName: req.body.fullName,
                    avatarUrl: req.body.avatarUrl
                },
            )
            res.json({
                success: true
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось обновить данные'
        })
    }
}