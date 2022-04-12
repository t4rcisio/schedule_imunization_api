import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const UserAuth = (request, response, next) => {
  console.log(request.url);
  if (
    request.url === "/nurse/create" ||
    request.url == "/nurse/login" ||
    request.url === "/"
  )
    return next();

  let hash;
  try {
    hash = request.cookies[process.env.COOKIE_KEY];
  } catch (error) {
    response.send("Invalid ky sdnaj");
  }

  if (!hash) response.send("go to login");

  try {
    const token = jsonwebtoken.verify(hash, process.env.SECRET_KEY_TOKEN);
  } catch (error) {
    response.send("Invalid token");
  }
  next();
};

export default UserAuth;
