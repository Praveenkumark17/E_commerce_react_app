import { config } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import router from "./router/authRouter.js";
import bodyParser from "body-parser";

config();
const app = express();

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

app.use(express.json());
app.use(cors({ origin: APP_URL, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(bodyParser.json());
connectDB();

app.use('/images', express.static('images'));
app.use("/api/auth", router);

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
  console.log(`App URL: ${APP_URL}`);
});


