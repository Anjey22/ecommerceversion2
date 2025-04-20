import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../Stores/useCartStore';

const SearchResults = () => {
	const { search } = useLocation();
	const query = new URLSearchParams(search).get('q');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(true);

	const { addToCart } = useCartStore();

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const { data } = await axiosInstance.get('/products');
				const filtered = data.filter((product) =>
					product.name.toLowerCase().includes(query.toLowerCase())
				);
				setResults(filtered);
			} catch (err) {
				console.error("Search error:", err);
			} finally {
				setLoading(false);
			}
		};

		if (query) fetchProducts();
	}, [query]);

	return (
		<div className='pt-24 pb-12 container mx-auto px-4'>
			<h2 className='text-2xl font-bold mb-6 text-white'>
				Search Results for "<span className="text-emerald-400">{query}</span>"
			</h2>

			{loading ? (
				<p className="text-gray-400">Loading...</p>
			) : results.length > 0 ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{results.map((product) => (
						<div
							key={product._id}
							className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'
						>
							<div className='overflow-hidden'>
								<img
									src={product.images?.[0]?.url || "/fallback.png"}
									alt={product.images?.[0]?.altText || product.name}
									className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "/fallback.png";
									}}
								/>
							</div>
							<div className='p-4'>
								<h3 className='text-lg font-semibold mb-2 text-white'>{product.name}</h3>
								<p className='text-emerald-300 font-medium mb-4'>
									${product.price.toFixed(2)}
								</p>
								<button
									onClick={() => addToCart(product)}
									className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center'
								>
									<ShoppingCart className='w-5 h-5 mr-2' />
									Add to Cart
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-300">No products found.</p>
			)}
		</div>
	);
};

export default SearchResults;
