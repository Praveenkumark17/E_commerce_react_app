import { config } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import router from "./router/authRouter.js";

config();
const app = express();

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

app.use(express.json());
app.use(cors({origin:APP_URL,methods:'GET,HEAD,PUT,PATCH,POST,DELETE'}));
connectDB();

app.use('/images',express.static('images'))
app.use("/api/auth", router);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in port ${process.env.PORT}`);
  console.log(`App running in port ${process.env.APP_URL}`);
});

