import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: []
    },
    like: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }]
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: String
}, {
    timestamps: true,
})

export default mongoose.model('Post', PostSchema)