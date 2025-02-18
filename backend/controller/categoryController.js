import Category from "../model/category.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import { put } from "@vercel/blob";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(__dirname, "../images/category");

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

export const addCategory = async (req, res) => {
    uploads.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            const { brand, categoryname, description } = req.body;
            if (!brand || !categoryname || !description) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const existingCategory = await Category.findOne({ categoryname });
            if (existingCategory) {
                return res.status(400).json({ message: "Category already exists" });
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

            const newCategory = new Category({
                brand,
                categoryname,
                description,
                image: imageUrl,
            });
            await newCategory.save();
            res.status(201).json({ message: "Category added successfully", newCategory });
        } catch (error) {
            res.status(500).json({ message: "Error registering category: " + error.message });
        }
    });
};


export const getCategorys = async (req, res) => {
  try {
    const Categorys = await Category.find();
    res.status(200).json(Categorys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  uploads.single('image')(req, res, async (err) => {
      if (err) {
          return res.status(500).json({ message: err.message });
      }
      try {
          const { id } = req.params;
          const { brand, categoryname, description } = req.body;
          const existingCategory = await Category.findOne({ categoryname });
          if (existingCategory && existingCategory._id.toString() !== id) {
              return res.status(400).json({ message: "Category already exists" });
          }

          let imageUrl = null;
      if (req.file) {
        const vercelBlobToken = process.env.VERCEL_BLOB_ACCESS_KEY;
        console.log(vercelBlobToken);
        if (!vercelBlobToken || vercelBlobToken === "") {
          const fileName = req.file.filename;
          imageUrl = `${fileName}`;
        } else {
          const blob = await put(`images/profile/${req.file.originalname}`, req.file.buffer, {
            access: "public",
          });
          imageUrl = blob.url;
        }
      }

          const updatedCategory = await Category.findByIdAndUpdate(
              id,
              {
                  brand,
                  categoryname,
                  description,
                  image: imageUrl,
              },
              { new: true }
          );
          if (!updatedCategory) {
              return res.status(404).json({ message: "Category not found" });
          }
          res.status(200).json({ message: "Category updated successfully", updatedCategory });
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  });
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};