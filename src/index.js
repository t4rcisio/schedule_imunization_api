import express from "express";
import dotenv from "dotenv";
import route from "./route/route.js";
import userAuth from "./utils/auth.js";
import cors from "cors";

dotenv.config();

const port = process.env.SERVER_PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(userAuth);
app.use(route);

app.listen(port, () => {
  console.log("Server running");
});
