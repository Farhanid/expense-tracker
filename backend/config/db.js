import mongoose from 'mongoose';


export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected Sucessfully🥳🔥 "))
    .catch(err => console.error('Error', err)) 
}