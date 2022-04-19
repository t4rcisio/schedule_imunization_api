import jsonwebtoken from "jsonwebtoken";

const Decode = (header) => {
  const { token } = header;

  let payload = {};
  try {
    payload = jsonwebtoken.verify(token, process.env.SECRET_KEY_TOKEN);
  } catch (error) {
    payload = {};
  }

  return { ...payload };
};

export default Decode;
