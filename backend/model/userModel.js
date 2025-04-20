import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },

    cartItems: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, default: 1 },
        },
      ],



    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
}, {
    timestamps: true,
});

// Pre-save hook to hash password before saving in DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Hashed Password:", this.password); // Log the hashed password
        next();
    } catch (error) {
        next(error);
    }
});

// Checking if password credentials (validity)
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password.trim(), this.password); // Trimmed password for comparison
};

const User = mongoose.model("User", userSchema);

export default User;
