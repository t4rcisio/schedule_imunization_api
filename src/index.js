import express from "express";
import dotenv from "dotenv";

import route from "./route/route.js";
import userAuth from "./utils/auth.js";

dotenv.config();

const port = process.env.SERVER_PORT || 5000;
const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Olá mundo");
});

app.use(userAuth);
app.use(route);

app.listen(port, () => {
  console.log("Server running");
});
