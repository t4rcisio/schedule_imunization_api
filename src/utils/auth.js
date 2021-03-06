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

  const token = request.headers.token;

  // Verify header token
  if (!token)
    return response
      .send({ error: true, message: "Login is required" })
      .status(403);

  // Check token authenticity
  try {
    const userAuth = jsonwebtoken.verify(token, process.env.SECRET_KEY_TOKEN);
  } catch (error) {
    return response
      .send({ error: true, message: "Session expired, you need login again" })
      .status(403);
  }

  // If all ok, continue
  return next();
};

export default UserAuth;
