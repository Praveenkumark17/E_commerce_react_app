import { config } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import router from "./router/authRouter.js";
import bodyParser from "body-parser";

config();
const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  next();
});

const allowedOrigins = [process.env.APP_URL || 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.options('*', cors(corsOptions), (req, res) => {
  res.sendStatus(204);
});


app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
connectDB();

app.use('/images', express.static('images'));
app.use("/api/auth", router);

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
  console.log(`App URL: ${APP_URL}`);
});


