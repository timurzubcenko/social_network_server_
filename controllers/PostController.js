import Post from "../models/Post.js"

export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
            userName: req.body.name,
            avatarUrl: req.body.avatarUrl
        })

        const post = await doc.save()

        res.json(post)
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось создать статью'
        })
    }
}

export const getAll = async (req, res) => {
    try {

        const posts = await Post.find().populate('user').exec()

        res.json(posts)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось получить посты'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        Post.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after',
            },
        )
            .then((doc) => {
                res.json(doc)
            })
            .catch((err) => {
                console.log(err)
            })

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось получить пост'
        })
    }
}

export const remove = async (req, res) => {
    try {

        const postId = req.params.id
        const post = await Post.findById(postId)
        const userId = req.userId

        if (String(post.user) === String(userId)) {
            Post.findOneAndDelete({
                _id: postId
            })
                .then((doc) => {
                    res.json({
                        success: true
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось удалить пост'
        })
    }
}

export const update = async (req, res) => {
    try {

        const postId = req.params.id
        await Post.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            },
        )

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось удалить обновить'
        })
    }
}

export const getUserPost = async (req, res) => {
    try {

        const userId = req.params.id

        const posts = await Post.find({ user: userId })

        res.json(posts)

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось найти посты пользователя'
        })
    }
}

export const like = async (req, res) => {
    try {

        const postId = req.params.id
        const post = await Post.findById(postId)

        if (post.like.includes(req.userId)) {
            //удаляет лайк 
            const newLike = post.like.filter((userId) => {
                return String(req.userId) !== String(userId)
            })
            await Post.findByIdAndUpdate(post._id, {
                like: newLike
            })
            res.status(200).json({ msg: 'Лайк удален' })
        }
        else {
            //добавляет лайк 
            await Post.findByIdAndUpdate(post._id, {
                like: [...post.like, req.userId]
            })
            res.status(200).json({ msg: 'Лайк добавлен' })
        }

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось поставить лайк'
        })
    }
}