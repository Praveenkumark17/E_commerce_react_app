import user from "../model/user.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, path.join(__dirname, "../images/profile"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const uploads = multer({ storage: storage });

export const register = async (req, res) => {
    uploads.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        try {
            const { username,email,mobile,age,gender, password } = req.body;
            if (!username || !email || !mobile || !age || !gender || !password) {
              return res.status(400).json({ message: "All fields are required" });
              }
            const existingUser = await user.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const newUser = new user({
                username,email,mobile,age,gender, password,
                image: req.file ? req.file.filename : null,
            });
            await newUser.save();
            res.status(201).json({ message: "User registered successfully",user });
        } catch (error) {
            res.status(500).json({ message: "Require all fields" });
        }
    });
};

export const login = async (req, res) => {
  const origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin);
  try {
    const { email, password } = req.body;
    const finduser = await user.findOne({ email });
    if (!finduser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (finduser.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "User logged in successfully",finduser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



