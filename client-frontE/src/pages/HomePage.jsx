
import React from 'react'
import { useEffect } from "react"
import CategoryItem from '../components/CategoryItem'
import { ProductStore } from "../Stores/productStore";
import FeaturedProducts from "../components/FeaturedProducts";


const categories = [
  { href: "/watches", name: "Watches", imageUrl: "/watch.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/tshirts", name: "Tshirts", imageUrl: "/tshirts.jpg"},
  {href: "/jeans", name: "Jeans", imageUrl:"/jeans.jpg"},
	{ href: "/glasses", name: "Glasses", imageUrl: "/glass.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bag.jpeg" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jacket.jpg" },
  { href: "/camera", name: "Camera", imageUrl: "/camera.jpg" },
  { href: "/phones", name: "Phones", imageUrl: "/phones.jpg" },

]

const HomePage = () => {

  const { fetchFeaturedProducts, products, isLoading } = ProductStore();

  useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
     <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <h1 className='text-center text-5xl sm:text-6xl font-bold text-pink-600 mb-4'>
            Explore all Categories
          </h1>
          <p className='text-center text-xl text-gray-900 mb-12 font-bold '>
            Discover the latest, shop in a snap</p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {categories.map(category =>(
                <CategoryItem category={category} key={category.name}
                />
              ))}
            </div>
             {/* Additional features *
            {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />} */}
     </div>

     {/* Bottom Header/Footer */}
     <footer className="bg-blue-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl font-semibold">Stay Connected</p>
          <div className="mt-4">
            <a
              href="/"
              className="text-lg text-gray-300 hover:text-pink-500 mx-2"
            >
              About Us
            </a>
            <a
              href="/"
              className="text-lg text-gray-300 hover:text-pink-500 mx-2"
            >
              Contact Us
            </a>
            <a
              href="/"
              className="text-lg text-gray-300 hover:text-pink-500 mx-2"
            >
              Terms & Conditions
            </a>
          </div>
          <p className="mt-2 text-gray-400 text-sm">
            &copy; 2024 {/* {new Date().getFullYear()} */} SnapShop. All Rights Reserved.
          </p>
        </div>  
      </footer>
    </div>
  )
}

export default HomePage
