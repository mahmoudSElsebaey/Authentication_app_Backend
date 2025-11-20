import User from "../../../config/db/models/User.model.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");

  if (!users.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.status(200).json({ users });
};
