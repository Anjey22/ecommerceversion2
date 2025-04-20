import mongoose from "mongoose";
 export const connectDB = async () => {
    try {
        const dataConection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB succesfully connected: ${dataConection.connection.host}`);
        
    } catch (error) {
        console.log("Coonection Error", error.message);
        
        
    }
 }