import Product from "../model/product.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import { put } from "@vercel/blob";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(__dirname, "../images/product");

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Disk storage for local storage
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Memory storage for Vercel Blob
const memoryStorage = multer.memoryStorage();

const uploads = multer({
  storage: process.env.VERCEL_BLOB_ACCESS_KEY ? memoryStorage : diskStorage
});

export const addProduct = async (req, res) => {
  uploads.single('image')(req, res, async (err) => {
    if (err) {
    return res.status(500).json({ message: err.message });
    }
    try {
    const { category, productname, quantity, price, description } = req.body;
    if (!category || !productname || !quantity || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingProduct = await Product.findOne({ productname });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    let imageUrl = null;
            if (req.file) {
                const vercelBlobToken = process.env.VERCEL_BLOB_ACCESS_KEY;
                if (!vercelBlobToken || vercelBlobToken === "") {
                    const fileName = req.file.filename;
                    imageUrl = `${fileName}`;
                } else {
                    const blob = await put(`images/product/${req.file.originalname}`, req.file.buffer, {
                        access: "public",
                    });
                    imageUrl = blob.url;
                }
            }

    const newProduct = new Product({
      category, productname, quantity, price, description,
      image: imageUrl,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
  });
  };
  
  export const getProducts = async (req, res) => {
    try {
      const categories = await Product.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product); // Return the product variable
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const updateProduct = async (req, res) => {
    uploads.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      try {
        const { id } = req.params;
        const { category, productname, quantity, price, description } = req.body;
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        const duplicateProduct = await Product.findOne({ productname });
        if (duplicateProduct && duplicateProduct._id.toString() !== id) {
          return res.status(400).json({ message: "Product already exists" });
        }

        let imageUrl = null;
            if (req.file) {
                const vercelBlobToken = process.env.VERCEL_BLOB_ACCESS_KEY;
                if (!vercelBlobToken || vercelBlobToken === "") {
                    const fileName = req.file.filename;
                    imageUrl = `${fileName}`;
                } else {
                    const blob = await put(`images/category/${req.file.originalname}`, req.file.buffer, {
                        access: "public",
                    });
                    imageUrl = blob.url;
                }
            }

        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            category,
            productname,
            quantity,
            price,
            description,
            image: imageUrl,
          },
          { new: true }
        );
        if (!updatedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", updatedProduct });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  };
  
  export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };  