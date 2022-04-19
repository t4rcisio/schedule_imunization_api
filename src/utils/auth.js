import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const UserAuth = (request, response, next) => {
  if (
    request.url === "/nurse/new" ||
    request.url === "/nurse/login" ||
    request.url === "/" ||
    request.url === "/patient/login" ||
    request.url === "/patient/new"
  )
    return next();

  const { token } = request.headers;
  if (!token) return response.send({ error: "Login required" }).status(403);

  try {
    const userAuth = jsonwebtoken.verify(token, process.env.SECRET_KEY_TOKEN);
  } catch (error) {
    return response.send({ error: "Session expired" }).status(403);
  }
  return next();
};

export default UserAuth;
