import express from "express";
import dotenv from "dotenv";
import url from "url";
import cookieParser from "cookie-parser";
import route from "./route/route.js";
import userAuth from "./utils/auth.js";

dotenv.config();

const port = process.env.SERVER_PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(userAuth);
app.use(route);

app.get("/", (request, response) => {
  response.send("<h1>Home Page</h2>");
});

app.listen(port, () => {
  console.log("Server running");
});
