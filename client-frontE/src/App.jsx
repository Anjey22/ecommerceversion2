import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";  
import Admin from "./pages/Admin"; 
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import SearchResults from './pages/SearchResults';
import { Toaster } from "react-hot-toast";
import { userStore } from "./Stores/userStore";
import { useEffect } from "react";
import { useCartStore } from "./Stores/useCartStore";

function App() {
  const { user, checkAuth, checkingAuth } = userStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems,user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-500 text-white relative overflow-hidden">
      {/* Background color */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,
          rgba(16,185,129,0.3)_0%,rgba(17, 243, 179, 0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LogIn /> : <Navigate to="/" />} />
          <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/login" />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to ="/login" />} />
          <Route path="/purchase-success" element={user ? <PurchaseSuccessPage /> : <Navigate to ="/login" />} />
          <Route path="/purchase-cancel" element={user ? <PurchaseCancelPage /> : <Navigate to ="/login" />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
