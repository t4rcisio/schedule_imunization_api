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
      pathname:
        "./nurse/edit/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNTM5OGViNDBhMDgwMTdiOTk2MmI4NiIsIm5hbWUiOiJUYXJjaXNvIiwiaWF0IjoxNjQ5NzgwNTU3LCJleHAiOjE2NDk4MDkzNTd9.Ixu0mpUesIkqNSOFfXBv2Uq9zFpAUCkndjX1AJ9iCf4",
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
