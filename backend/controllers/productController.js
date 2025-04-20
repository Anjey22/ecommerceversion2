import Product from '../model/productModel.js';
import cloudinary from "../lib/cloudinary.js";
import { redis } from '../lib/redis.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      images: cloudinaryResponse?.secure_url 
        ? [{ url: cloudinaryResponse.secure_url, altText: name }] 
        : [],
      category,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Update a product by ID
export const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, images, isFeatured } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, images, isFeatured },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



//Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const delProduct = await Product.findByIdAndDelete(req.params.id);

    if (!delProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (delProduct.image){
      const publicId = delProduct.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`delproducts/${publicId}`)
        console.log("image deleted from cloudinary")
      }catch(error){
        console.log("error deleting image from cloudinary", error)
  
  }
}
await Product.findByIdAndDelete(req.params.id)
res.json({message: "Product deleted succesfully"})
}catch(error){
  console.log("Error in deleteProduct controller", error.message)
  res.status(500).json({message: "Server error", error: error.message})
}
};




// Get all featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

      //if not in redis, fetct from mongoDB
      //.lean() is gonna return a plain javascript object instead of mongoDB document
      //which is good for performance

      featuredProducts = await Product.find({isFeatured:true}).lean();
      if (!featuredProducts){
        return res.status(404).json({message: "No featured Product is available"});
    }

    //store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);

  } catch (error) {
    console.log("Error in getFeaturedProducts controller",error.message);
    res.status(500).json({message: "Server Error", error:error.message});
    
  }
}

//getRecommendations
export const getRecommendations = async (req,res) => {

  try {
    const products = await Product.aggregate([

    {
      $sample: {size:3}
    },
    {
      $project:{
        _id:1,
        name:1,
        description:1,
        images:1,
        price:1,
      }
    }
    ])

    res.json(products);

  } catch (error) {
    console.log("Error in getRecommendations controller", error.message);
    res.status(500).json({message: "Server error", error: error.message})
    
  }
};


//getByCategory
export const  getByCategory = async (req, res) => {
  const {category} = req.params;
  try {
    const products = await Product.find({category});
    res.json({ products: products || [] });

  } catch (error) {
    console.log("Error in getByCategory controller", error.message);
    res.status(500).json({message: "Server error", error: error.message});
    
  }
}

//toggleFeaturedProduct

export const toggleFeaturedProduct = async (req,res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product){
      product.isFeatured =!product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updateProduct);
    }else{
      res.status(404).json({message:"Product not found"});
    }

  } catch (error) {
    
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({message: "Server error", error: error.message});
  }
}

async function updateFeaturedProductsCache(){
  try {
    //The lean() method is used to return plain Javascript objects instead of full mongoose documents.
  
    const featuredProducts = await Product.find({ isFeatured: true}).lean();
    await redis.set("features_products", JSON.stringify(featuredProducts));
  
  } catch (error) {
    console.log("Error to update cache function");
    
    
  }
}
