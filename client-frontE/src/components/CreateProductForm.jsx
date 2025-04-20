import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { ProductStore } from '../Stores/productStore';
import toast from 'react-hot-toast'; // ✅ added toast

const categories = ["jeans", "tshirts", "shoes", "glasses", "jackets", "bags", "watches", "camera", "phones"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		stock: "",
		image: "",
	});

	const { createProduct, loading } = ProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createProduct(newProduct);
			toast.success("Product created successfully!"); // ✅ success toast
			setNewProduct({ name: "", description: "", price: "", category: "", stock: "", image: "" });
		} catch {
			toast.error("Error creating product."); // ✅ error toast
			console.log("error creating a product");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};

			reader.readAsDataURL(file);
		}
	};

	return (
		<motion.div
			className='bg-blue-600 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h1 className='text-2xl font-semibold mb-6'>Add New Product</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Product Name */}
				<div>
					<label htmlFor='name' className="block font-medium">Product name:</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						className='mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
					/>
				</div>

				{/* Description */}
				<div>
					<label htmlFor='description' className="block font-medium">Description:</label>
					<textarea
						id="description"
						name="description"
						required
						rows='3'
						className='mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
					/>
				</div>

				{/* Price */}
				<div>
					<label htmlFor='price' className="block font-medium">Price:</label>
					<input
						type="number"
						id="price"
						name="price"
						required
						className='mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
					/>
				</div>

				{/* Category */}
				<div>
					<label htmlFor='category' className="block font-medium">Category:</label>
					<select
						id="category"
						name="category"
						required
						className='mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
					>
						<option value="" disabled>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>{category}</option>
						))}
					</select>
				</div>

				{/* Stock */}
				<div>
					<label htmlFor='stock' className="block font-medium">Stock:</label>
					<input
						type="number"
						id="stock"
						name="stock"
						required
						className='mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500'
						value={newProduct.stock}
						onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
					/>
				</div>

				{/* Image Upload */}
				<div className='mt-1 flex items-center'>
					<input
						type="file"
						id="image"
						name="image"
						accept="image/*"
						className='sr-only'
						onChange={handleImageChange}
					/>
					<label htmlFor='image' className='cursor-pointer mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500'>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded</span>}
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className='mt-4 bg-pink-700 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition flex items-center gap-2'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle size={20} />
							Add Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};

export default CreateProductForm;
