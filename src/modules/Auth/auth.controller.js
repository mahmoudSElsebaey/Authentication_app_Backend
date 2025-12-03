import jwt from "jsonwebtoken";
import User from "../../../config/db/models/User.model.js";
import bcrypt from "bcrypt";

// _______________________________________________ Register __________________________________________
export const register = async (req, res) => {
  const { fname, lname, email, password, age } = req.body;

  if (!fname || !lname || !email || !password || !age) {
    res.status(404).json({ message: "All fields are required" });
  }

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    res.status(404).json({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fname,
    lname,
    email,
    password: hashPassword,
    age,
  });

  const token = jwt.sign(
    {
      userInfo: {
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "15m" }
  ); // expire in 15 minits

  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  ); // expire in 7 days ,  then the user must signin again

  res.cookie("jwt", refreshToken, {
    httpOnly: true, //
    secure: true, // https
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24 * 7, // ==> 7 days as like refresh token
  });

  res.json({
    accessToken: token,
    email: user.email,
    fname: user.fname,
    lname: user.lname,
    age: user.age,
  });
};
// _______________________________________________ Login __________________________________________
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid Password" });
  }
  const token = jwt.sign(
    {
      userInfo: {
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //
    secure: true, // https
    sameSite: "None", // cross-site
    maxAge: 1000 * 60 * 60 * 24 * 7, // ==> 7 days as like refresh token
  });

  res.status(200).json({
    accessToken: token,
    email: user.email,
    password: user.password,
  });
};
// _______________________________________________ Refresh __________________________________________
/* Refresh access token using refresh token stored in cookie*/
export const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" }); // Unauthorized

  // Verify refresh token
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" }); // Forbidden

      const foundUser = await User.findById(decoded.userInfo.id).exec(); // Check if user still exists
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      // Create new access token
      const accessToken = jwt.sign(
        { userInfo: { id: foundUser._id } },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken }); // Send new access token to client
    }
  );
};
// _______________________________________________ Logout __________________________________________

export const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" }); // Unauthorized
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  res.status(200).json({ message: "Logged out successfully" });
};
