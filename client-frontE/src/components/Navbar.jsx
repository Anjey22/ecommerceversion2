import React, { useState } from 'react';
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Search } from 'lucide-react';
import { Link } from "react-router-dom";
import { userStore } from '../Stores/userStore';
import { useCartStore } from '../Stores/useCartStore';

import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = userStore();
    const isAdmin = user?.role === "admin";
    const {cart} = useCartStore();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();


    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div>
            <header className='fixed top-0 left-0 w-full bg-blue-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800 px-8'>
                <div className='container mx-auto px-4 py-3'>
                    <div className='flex items-center justify-between'>
                        {/* Logo */}
                        <Link to='/' className='flex items-center space-x-2'>
    <img 
        src="/snap.png" 
        alt="SnapShop Logo" 
        className="h-10 w-15 object-contain rounded-md"
    />
    <span className="text-2xl font-bold text-white">SnapShop</span>
</Link>


                        
    <div className='flex-grow flex justify-center'>
    <form onSubmit={handleSearch} className="relative w-full max-w-md ml-16">
        <div className="relative ml-10">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-black rounded-md px-4 py-2 pr-12 outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Search products..."
            />
            <button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-pink-600 text-white p-2 rounded-md hover:bg-pink-600 transition">
                <Search size={20} />
            </button>
        </div>
    </form>
</div>

                        {/* Nav Links */}
                        <nav className='flex items-center gap-4'>
                            <Link to="/" className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
                                Home
                            </Link>
                            {user && (
                                <Link to={"/cart"} className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
                                    <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                    <span className='hidden sm:inline'>Cart</span>
                                    {cart.length >0 && (<span className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
                                    text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'>{cart.length}</span>)}
                                </Link>
                            )}
                            {isAdmin && (
                                <Link className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
                                 flex items-center transition duration-300 ease-in-out'
                                 to={"/admin"}>
                                    <Lock className='inline-block mr-1' size={18} />
                                    <span className='hidden sm:inline'>Dashboard</span>
                                </Link>
                            )}
                            {user ? (
                                <button
                                    className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                    onClick={logout}>
                                    <LogOut size={18} />
                                    <span className='hidden sm:inline ml-2'>Logout</span>
                                </button>
                            ) : (
                                <>
                                    <Link to={"/signup"} className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center'>
                                        <UserPlus className='mr-2' size={18} />
                                        Signup
                                    </Link>
                                    <Link to={"/login"} className='bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center'>
                                        <LogIn className='mr-2' size={18} />
                                        Login
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
