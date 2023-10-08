import JWT from "jsonwebtoken";

export const generateToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
