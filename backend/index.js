import { config } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import router from "./router/authRouter.js";
import bodyParser from "body-parser";

config();
const app = express();

const allowedOrigins = [process.env.APP_URL || "http://localhost:3000", "https://e-commerce-client-swart.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS globally
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
connectDB();

// Preflight handling for all routes
app.options("*", cors(corsOptions));

// Serve static images
app.use("/images", express.static("images"));

// Authentication routes
app.use("/api/auth", router);

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
  console.log(`Allowed Origins: ${allowedOrigins}`);
});



