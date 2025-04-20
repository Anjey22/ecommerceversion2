import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../Stores/useCartStore";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	// Utility function to check if the coupon is expired
	const isExpired = (date) => new Date(date) < new Date();

	useEffect(() => {
		// Fetch the coupon data when the component mounts
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		// If the coupon is valid, set the code in the input field
		if (coupon && !isExpired(coupon.expirationDate)) {
			setUserInputCode(coupon.code);
		} else if (coupon && isExpired(coupon.expirationDate)) {
			// If the coupon is expired, remove it
			removeCoupon();
			setUserInputCode("");
		}
	}, [coupon, removeCoupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		// Do not clear the coupon, keep it in the available coupons list
		setUserInputCode("");
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-white p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-black'>
						Do you have a voucher or gift card?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full rounded-lg border border-gray-600 bg-gray-200 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-gray-500'
						placeholder='Enter code here'
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value)}
						required
					/>
				</div>

				<motion.button
					type='button'
					className='flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApplyCoupon}
				>
					Apply Code
				</motion.button>
			</div>

			{/* Show applied coupon if valid */}
			{isCouponApplied && coupon && !isExpired(coupon.expirationDate) && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Applied Coupon</h3>
					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
					<motion.button
						type='button'
						className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleRemoveCoupon}
					>
						Remove Coupon
					</motion.button>
				</div>
			)}

			{/* Show the available coupon if valid */}
			{coupon && !isExpired(coupon.expirationDate) && !isCouponApplied && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Your Available Coupon:</h3>
					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
				</div>
			)}

			{/* Optional: Show a message when no valid coupon is available */}
			{!coupon && !isCouponApplied && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-black'>No active coupon available</h3>
				</div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;
