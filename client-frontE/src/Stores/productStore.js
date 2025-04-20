import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const ProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
  set({ loading: true });
  try {
    const response = await axios.get("/products");  // Ensure the correct API endpoint
    console.log("API Response:", response.data); // Log response data
    set({ products: response.data, loading: false });
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    set({ error: "Failed to fetch products", loading: false });
    toast.error(error.response?.data?.error || "Failed to fetch products");
  }
},
fetchProductsByCategory: async (category) => {
    try {
        const response = await fetch(`/api/products/category/${category}`);
        const data = await response.json();
        set({ products: data.products });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
},

	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));