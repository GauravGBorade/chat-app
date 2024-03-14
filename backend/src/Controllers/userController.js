import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//! Register the user
//* Route - /api/user/register

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Enter All Fields" });
  }

  try {
    //check if user already exists in db
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }
    // if not create the user, but first let's encrypt the password before storing it to the database.
    const hashedPassword = await hashPassword(password);

    //create the user with hashed password.
    user = new User({
      email,
      name,
      password: hashedPassword,
    });
    //save the user
    await user.save();

    //create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    //send user details along with token as response
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(400).json({ message: "Error Creating the User" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

//!login the user
//* Route - /api/user/login
export const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Couldn't Find User" });
  }

  try {
    //find the user with given email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //check if passwords match
    const doesPasswordsMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordsMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    //send user details along with token as response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//!Get Users for searching
export const getAllUsers = async (req, res) => {
  //get the search query from query and match either email or name with search input
  const searchQuery = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  //find user with search query and return
  try {
    let users = await User.find(searchQuery).where({
      _id: { $ne: req.user._id },
    });
    res.send(users);
  } catch (error) {}
};

const hashPassword = async function (password) {
  return bcrypt.hash(password, 8);
};
