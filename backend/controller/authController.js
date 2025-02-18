import user from "../model/user.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import { put } from "@vercel/blob";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(__dirname, "../images/profile");

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

export const register = async (req, res) => {
  uploads.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    try {
      const { username, email, mobile, age, gender, password } = req.body;
      if (!username || !email || !mobile || !age || !gender || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existingUser = await user.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      let imageUrl = null;
      if (req.file) {
        const vercelBlobToken = process.env.VERCEL_BLOB_ACCESS_KEY;
        if (!vercelBlobToken) {
          const fileName = req.file.filename;
          imageUrl = `/images/profile/${fileName}`;
        } else {
          const blob = await put(`images/profile/${req.file.originalname}`, req.file.buffer, {
            access: "public",
          });
          imageUrl = blob.url;
        }
      }

      const newUser = new user({
        username,
        email,
        mobile,
        age,
        gender,
        password,
        image: imageUrl,
      });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error registering user" });
    }
  });
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const finduser = await user.findOne({ email });
    if (!finduser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (finduser.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "User logged in successfully", finduser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
