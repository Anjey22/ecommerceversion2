import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust for deployment

export const useCartStore = create((set, get) => ({
  fetchCart: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`);
      set({ cart: response.data.cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  },

  cart: JSON.parse(localStorage.getItem("cart")) || [], // Load from storage on start
  coupon: null,
  total: 0,
  subtotal: 0,

  getMyCoupon: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/coupon`);
  
      const coupon = response.data;
  
      // ⏳ Check for expiration
      if (coupon && new Date(coupon.expirationDate) < new Date()) {
        set({ coupon: null, isCouponApplied: false });
        toast.error("Your coupon has expired.");
        return;
      }
  
      set({ coupon });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },
  

  applyCoupon: async (code) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/coupon/validate`, { code });

      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  // 🛒 Fetch cart items from API
  getCartItems: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/cart`, { withCredentials: true });
      if (res.data && Array.isArray(res.data)) {
        set({ cart: res.data });
        get().calculateTotals();

        // ✅ Only update local storage if the cart is successfully fetched
        localStorage.setItem("cart", JSON.stringify(res.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch cart");
    }
  },
  clearCart: async () => {
    try {
      // 🧹 Clear the cart in the backend too
      await axios.delete(`${API_BASE_URL}/cart`, { withCredentials: true });
    } catch (err) {
      console.error("Failed to clear backend cart:", err);
    }
  
    // 🧹 Clear frontend cart
    localStorage.removeItem("cart");
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
  

  // ➕ Add to cart
  addToCart: async (product) => {
    try {
      const toastId = toast.loading("Adding item to cart...");

      const res = await axios.post(`${API_BASE_URL}/cart`, { productId: product._id }, { withCredentials: true });

      if (res.data) {
        set((prevState) => {
          const existingItem = prevState.cart.find((item) => item._id === product._id);
          const newCart = existingItem
            ? prevState.cart.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
              )
            : [...prevState.cart, { ...product, quantity: 1 }];

          localStorage.setItem("cart", JSON.stringify(newCart));

          return { cart: newCart };
        });

        get().calculateTotals();
        toast.success("Item added to cart! 🛒", { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add item ❌");
    }
  },

  calculateTotals: () => {
    const total = get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    set({ total });
  },

  // ❌ Remove from cart
  removeFromCart: async (productId) => {
    try {
      console.log("Removing product:", productId);

      // Remove item from cart in the backend
      await axios.delete(`/cart/${productId}`);

      // Update local state immediately after removal
      set((state) => {
        const newCart = state.cart.filter((item) => item._id !== productId);  // Filter out the removed item
        localStorage.setItem("cart", JSON.stringify(newCart)); // Update localStorage
        return { cart: newCart };
      });

      // Recalculate the total after removal
      get().calculateTotals(); // This ensures the totals are updated

    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  },

  // 🧾 Calculate totals
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },

  updateQuantity: async (productId, newQuantity) => {
    try {
      // If quantity is 0 or less, remove the item from the cart
      if (newQuantity <= 0) {
        // Remove item from the backend
        await axios.delete(`/cart/${productId}`);

        // Remove item from local state
        set((state) => {
          const updatedCart = state.cart.filter((item) => item._id !== productId);
          localStorage.setItem("cart", JSON.stringify(updatedCart)); // Sync with localStorage
          return { cart: updatedCart };
        });

        // Recalculate totals after removing the item
        get().calculateTotals();

        return; // Exit the function after removal`
      }

      // If the quantity is positive, update it in the backend
      const res = await axios.put(`/cart/${productId}`, { quantity: newQuantity });

      // Update local state immediately
      set((state) => {
        const updatedCart = state.cart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Sync with localStorage
        return { cart: updatedCart };
      });

      // Recalculate totals after quantity update
      get().calculateTotals();

    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  },

  // 🛍️ Checkout and clear cart after successful order
  handleCheckoutSuccess: async () => {
    try {
      const orderResponse = await axios.post(`${API_BASE_URL}/order`, { cart: get().cart });

      if (orderResponse.status === 200) {
        // Clear the cart after a successful checkout
        await get().clearCart(); // Clears the cart and resets totals
        toast.success("Order placed successfully!");
      }
    } catch (error) {
      toast.error("Order failed. Please try again.");
    }
  },

}));
