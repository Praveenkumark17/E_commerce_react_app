import Category from "../model/category.js";
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(__dirname, "../images/category");

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

export const addCategory = async (req, res) => {
    uploads.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            const { brand, categoryname, description, storeLocally } = req.body;
            if (!brand || !categoryname || !description) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const existingCategory = await Category.findOne({ categoryname });
            if (existingCategory) {
                return res.status(400).json({ message: "Category already exists" });
            }

            let imageUrl = null;
            if (req.file) {
                if (storeLocally) {
                    const fileName = Date.now() + path.extname(req.file.originalname);
                    const filePath = path.join(uploadDirectory, fileName);
                    fs.writeFileSync(filePath, req.file.buffer);
                    imageUrl = `/images/category/${fileName}`;
                } else {
                    const imageFile = req.file;
                    const blob = await put(`/images/category/${imageFile.originalname}`, imageFile.buffer, {
                        access: 'public',
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
            res.status(500).json({ message: error.message });
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
          const { brand, categoryname, description, storeLocally } = req.body;
          const existingCategory = await Category.findOne({ categoryname });
          if (existingCategory && existingCategory._id.toString() !== id) {
              return res.status(400).json({ message: "Category already exists" });
          }

          let imageUrl = null;
          if (req.file) {
              if (storeLocally) {
                  const fileName = Date.now() + path.extname(req.file.originalname);
                  const filePath = path.join(uploadDirectory, fileName);
                  fs.writeFileSync(filePath, req.file.buffer);
                  imageUrl = `/images/category/${fileName}`;
              } else {
                  const imageFile = req.file;
                  const blob = await put(`/images/category/${imageFile.originalname}`, imageFile.buffer, {
                      access: 'public',
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