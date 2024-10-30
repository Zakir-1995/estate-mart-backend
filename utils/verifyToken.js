import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  const token = req?.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(401).json({ message: "Token is not valid!" });
    req.userId = payload.id;
    next();
  });
};


