import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully Connected To Database');
    }catch (error) {
        return res.status(500).json({
            message: "An error occurred while connecting with database",
            error: error.message,
            success: false
        });
    }
};
export default connectDB;