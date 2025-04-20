
import Product from "../model/productModel.js";
import User from "../model/userModel.js"; // 


export const getCartProducts = async (req, res) => {
    try {
      const productIds = req.user.cartItems.map((item) => item.productId); // ✅ Extract product IDs
  
      const products = await Product.find({ _id: { $in: productIds } });
  
      const cartItems = products.map((product) => {
        const item = req.user.cartItems.find((cartItem) => cartItem.productId.toString() === product._id.toString());
        return { ...product.toJSON(), quantity: item.quantity };
      });
  
      res.json(cartItems);
    } catch (error) {
      console.log("Error in getCartProducts controller", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  export const addToCart = async (req, res) => {
    try {
      console.log("🔍 Received request body:", req.body); // Debug request payload
      console.log("🔍 Authenticated user:", req.user); // Debug user authentication
  
      const { productId } = req.body;
      const user = req.user;
  
      if (!user) {
        console.log("❌ No user found in request");
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }
  
      if (!productId) {
        console.log("❌ No productId received");
        return res.status(400).json({ message: "Product ID is required" });
      }
  
      if (!user.cartItems) {
        user.cartItems = [];
      }
  
      const existingItem = user.cartItems.find((item) => item.productId?.toString() === productId);
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.cartItems.push({ productId, quantity: 1 });
      }
  
      await user.save();
      res.json(user.cartItems);
    } catch (error) {
      console.error("❌ Error in addToCart controller:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  export const removeAllFromCart = async (req, res) => {
    try {
        const productId = req.params.id;  // ✅ Get productId from URL
        console.log("🛑 Product ID to remove:", productId);
        
        const user = req.user;

        if (!productId) {
            user.cartItems = []; // ✅ Remove all items
        } else {
            user.cartItems = user.cartItems.filter((item) => item.productId.toString() !== productId); // ✅ Remove only selected item
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in removeAllFromCart controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params; // Product ID from request
        const userId = req.user.id; // Get logged-in user ID

        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        console.log(`Removing item ${id} from user ${userId}'s cart`);

        // Find user and update cart
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out the product from the cart
        user.cartItems = user.cartItems.filter((item) => item.productId.toString() !== id);

        await user.save();

        res.status(200).json({ message: "Item removed successfully", cart: user.cartItems });
    } catch (error) {
        console.error("❌ Error removing item from cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

  export const updateQuantity = async (req, res) => {
    try {
      const { id: productId } = req.params; // Correct parameter
      const { quantity } = req.body;
      const user = req.user; // ✅ Get user
  
      const existingItem = user.cartItems.find((item) => item.productId.toString() === productId);
      
      if (existingItem) {
        if (quantity === 0) {
          user.cartItems = user.cartItems.filter((item) => item.productId.toString() !== productId);
        } else {
          existingItem.quantity = quantity;
        }
        
        await user.save();
        return res.json(user.cartItems);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.log("Error updateQuantity controller", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  