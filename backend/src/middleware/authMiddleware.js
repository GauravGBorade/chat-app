import jwt from "jsonwebtoken";
import User from "../models/user.js";

//! authorize user middleware
//* Route - /api/user

const verifyToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from authorization header
      token = req.headers.authorization.split(" ")[1];
      //verify token and then decode user from it
      const decodedUserInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
      //set user in request
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
