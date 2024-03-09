import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        mongoose
            .connect(process.env.URL_MONGO)
            .then(() => { console.log('Connect DB') })
    }
    catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

export default connectDB