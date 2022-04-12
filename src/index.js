import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import url from "url";

import route from "./route/route.js";

dotenv.config();

const port = process.env.SERVER_PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.get("/", (request, response) => {
  response.cookie(process.env.COOKIE_KEY, "abc", {
    maxAge: 60 * 60 * 8,
    httpOnly: true,
    secure: true,
    path: "/",
  });
  response.redirect(
    url.format({
      pathname: "./nurse/edit/625398eb40a08017b9962b86",
      query: {
        name: "Tarciso",
        cpf: "12405581639",
        password: "887455488",
      },
    })
  );
});

app.use(route);

app.listen(port, () => {
  console.log("Server running");
});
