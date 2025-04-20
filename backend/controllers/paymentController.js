
import Coupon from '../model/couponModel.js';
import { stripe } from '../lib/stripe.js';
import Order from '../model/orderModel.js';

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        let totalAmount = 0;
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100); // the amount is in cents
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupon) {
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon
                ? [
                    {
                        coupon: await createStripeCoupon(coupon.discountPercentage),
                    },
                ]
                : [],
        
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        });

        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};

export const checkOutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            // ✅ Prevent duplicate orders
            const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
            if (existingOrder) {
                return res.status(200).json({
                    success: true,
                    message: "Order already processed.",
                    orderId: existingOrder._id,
                });
            }

            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    { code: session.metadata.couponCode, userId: session.metadata.userId },
                    { isActive: false }
                );
            }

            const products = JSON.parse(session.metadata.products || "[]");

            // Creating the order with updated field name
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map(product => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: sessionId,
            });
            

            await newOrder.save();

            // Check if the total amount is greater than $50 to generate a coupon
            const totalAmount = session.amount_total / 100; // Convert to dollars

            if (totalAmount >= 50) {
                const newCoupon = await createNewCoupon(session.metadata.userId);
                console.log('New coupon generated:', newCoupon);
            }

            res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });
        } else {
            res.status(400).json({ message: "Payment not completed." });
        }
    } catch (error) {
        console.error("Error processing successful checkout:", error);
        res.status(500).json({ message: "Error processing successful checkout", error: error.message });
    }
};

// Helper function to create a unique coupon code
async function createNewCoupon(userId) {
    let couponCode = "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();
    let existingCoupon = await Coupon.findOne({ code: couponCode });

    // Retry generating the coupon code if it already exists
    while (existingCoupon) {
        couponCode = "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();
        existingCoupon = await Coupon.findOne({ code: couponCode });
    }

    const newCoupon = new Coupon({
        code: couponCode, // Generate a unique code
        discountPercentage: 10, // Set the discount percentage
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
        userId: userId, // Link the coupon to the user
    });

    // Save the coupon to the database
    await newCoupon.save();

    return newCoupon; // Return the created coupon
}

// Helper function to create Stripe coupon
// Simple function to create a Stripe coupon
async function createStripeCoupon(discountPercentage) {
    // Create a coupon in Stripe with a discount percentage
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: 'once', // The coupon is applied only once for this purchase
    });
    
    // Return the Stripe coupon ID
    return coupon.id;
}
