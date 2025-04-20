import React from "react";
import { Minus, Plus, Trash, ChevronLeft } from "lucide-react";
import { useCartStore } from "../Stores/useCartStore";
import { Link } from "react-router-dom";

const CartItem = ({ item }) => {
  console.log("CartItem received:", item);

  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    
    <div className="rounded-lg border p-4 shadow-sm border-black bg-white md:p-6 relative">
     

      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 mt-6">
        {/* Image Section */}
        <div className="shrink-0 md:order-1" />

        <img
          className="h-20 md:h-32 rounded object-cover"
          src={
            Array.isArray(item.images) && item.images.length > 0
              ? item.images[0].url
              : "https://via.placeholder.com/150"
          }
          alt={item.images?.[0]?.altText || item.name}
        />

        {/* Item Details */}
        <div className="flex-1">
          <h3 className="text-black font-semibold">{item.name}</h3>
          <p className="text-pink-800 pb-5">Price: ${item.price}</p>

          {/* Remove Button */}
          <button
            onClick={() => removeFromCart(item._id)}
            className="p-2 bg-red-600 rounded text-white"
          >
            <Trash size={16} />
          </button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="p-2 bg-red-600 rounded text-white"
          >
            <Minus size={16} />
          </button>
          <span className="text-black">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="p-2 bg-red-600 rounded text-white"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
