

import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { userStore } from "../Stores/userStore";
import { useCartStore } from "../Stores/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = userStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart`, { id: product.id });
  };
  


  

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-white h-full">
  <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
    <img
      className="object-cover w-full"
      src={product?.images?.length > 0 ? product.images[0].url : "/placeholder.jpg"}
      alt={product?.images?.length > 0 ? product.images[0].altText || "Product image" : "Placeholder image"}
    />
    <div className="absolute inset-0 bg-black bg-opacity-20" />
  </div>

  <div className="flex flex-col flex-1 justify-between px-5 pb-5 mt-4">
    <div>
      <h5 className="text-xl font-semibold tracking-tight text-black">
        {product.name}
      </h5>
      <div className="mt-2">
        <p className="text-base text-gray-700">{product.description}</p>
        <div className="mt-4">
          <span className="text-2xl font-bold text-red-600">${product.price}</span>
        </div>
      </div>
    </div>

    <button
      className="mt-5 flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium
         text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
      onClick={handleAddToCart}
    >
      <ShoppingCart size={22} className="mr-2" />
      Add to cart
    </button>
  </div>
</div>

  );
};

export default ProductCard;

