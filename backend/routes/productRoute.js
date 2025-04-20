
import  express from 'express';
import { protectRoute } from '../middleware/AuthMiddleWare.js';
import { adminRoute } from '../middleware/AuthMiddleWare.js';
import { createProduct,
    deleteProduct,
     getAllProducts,
     getFeaturedProducts,
      getRecommendations,
      getByCategory,
      toggleFeaturedProduct
     } from '../controllers/productController.js';

//productRoute

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured",  getFeaturedProducts);
router.get("/category/:category",  getByCategory);
router.get("/recommendations", getRecommendations);
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

export default router;
