import React, { useEffect } from 'react';
import { ProductStore } from '../Stores/productStore';
import { useParams, Link } from 'react-router-dom';  // Import Link from react-router-dom
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { ChevronLeft } from "lucide-react";  // Import the ChevronLeft icon

const CategoryPage = () => {
    const { fetchProductsByCategory, products } = ProductStore();
    const { category } = useParams();

    useEffect(() => {
        if (category) fetchProductsByCategory(category);
    }, [category]);

    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                
                {/* Category Title with Back Arrow beside it */}
                <div className="flex items-center mb-10">
                    <Link to="/" className="p-2 bg-gray-600 text-white rounded-full shadow-md hover:bg-black mr-4">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <motion.h1
                        className='text-left text-4xl sm:text-5xl font-bold text-pink-700 underline'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </motion.h1>
                </div>

                <motion.div
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {products?.length === 0 && (
                        <h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
                            No products found
                        </h2>
                    )}

                    {products?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export default CategoryPage;
