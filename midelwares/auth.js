import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.header("Autorization");
  if (!token) return res.status(401).send("Acces denied.No token porovided");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}
