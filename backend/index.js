import { config } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import router from "./router/authRouter.js";
import bodyParser from "body-parser";

config();
const app = express();

// ✅ Define allowed origins
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  "https://e-commerce-client-swart.vercel.app"
];

// ✅ CORS options with fallback for undefined origin (like Postman or server-to-server)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// ✅ Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Parse incoming JSON
app.use(express.json());
app.use(bodyParser.json());

// ✅ Connect to DB
connectDB();

// ✅ Serve static images
app.use("/images", express.static("images"));

// ✅ Routes
app.use("/api/auth", router);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(", ")}`);
});




