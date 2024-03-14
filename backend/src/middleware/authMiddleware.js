import jwt from "jsonwebtoken";
import User from "../models/user.js";

const verifyToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodedUserInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decodedUserInfo.userId).select(
        "-password"
      );
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }
};

export default verifyToken;
