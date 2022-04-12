import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

dotenv.config();

const UserAuth = (request, response, next) => {
  if (request.url === "/nurse/create" || request.url == "/nurse/login")
    return next();

  const hash = request.cookies[process.env.COOKIE_KEY];

  if (!hash) response.send("go to login");

  try {
    const token = jsonwebtoken.verify(hash, process.env.SECRET_KEY_TOKEN);
  } catch (error) {
    response.send("Invalid token");
  }
  next();
};

export default UserAuth;
