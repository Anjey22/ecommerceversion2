import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cartRoute from "./routes/cartRoute.js"
import couponRoute from "./routes/couponRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import analyticsRoute from "./routes/analyticsRoute.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Enable CORS before defining routes
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend requests
    credentials: true, // Allow cookies and authentication headers
}));

// Middleware to parse JSON
app.use(express.json({ limit: '10mb' })); //file/image limit
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/analytics", analyticsRoute); 

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Connect to the Database
connectDB().then(() => {
    // Start the server after the database connection is successful
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1); // Exit the process with an error code
});

