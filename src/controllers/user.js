import User from "../models/userModel.js";
import API from "../models/apiKeysModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";
import crypto from "crypto";
import Template from "../models/templateModel.js";
import sentMails from "../models/sentMailDataModel.js";
import Cred from "../models/credModel.js";
import BusinessUser from "../models/businessUsers.js";

const generateAPIkey = (id) => {
  const hash = crypto
    .createHash("sha256")
    .update(id + Date.now().toString())
    .digest("base64");

  return hash.replace(/[^a-zA-Z0-9]/g, "").substring(0, 50);
};

export const createUser = async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });

    let userAPI;
    let isunique = false;

    while (!isunique) {
      userAPI = generateAPIkey(newUser._id);

      const existingAPIkey = await API.findOne({ APIKEY: userAPI });

      if (!existingAPIkey) {
        isunique = true;
      }
    }

    const newAPI = await API.create({
      userId: newUser._id,
      APIKEY: userAPI,
      creationDate: Date.now(),
    });

    await User.findByIdAndUpdate(newUser._id, { apiKeyId: newAPI._id });

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        APIKEY: userAPI,
      },
      token, // Send the token in response
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
      },
      token, // Send the token in response
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//only for admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  console.log("reached user")
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    if (password) {
      return res
        .status(403)
        .json({ message: "Only user can edit their password" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateUser = async (req, res) => {
  try {
    let { password, ...updateData } = req.body;

    // If password is provided, hash it before updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    let deletedUser;

    deletedUser = await User.findByIdAndDelete(req.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    let deletedUser;

    deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedTemplates = await Template.deleteMany({ userID: req.params.id });

    const deletedsentMailsHistory = await sentMails.deleteMany({ userId: req.params.id });

    const deletedCreds = await Cred.deleteMany({ userID: req.params.id });

    const deletedBusinessUsers = await BusinessUser.deleteMany({ createdByUserId: req.params.id });

    const deletedAPIKEYS = await API.deleteMany({ userId: req.params.id });

    res.status(200).json({
      message: "User and associated data is deleted successfully",
      deletedTemplatesCount: deletedTemplates.deletedCount,
      deletedsentMailsHistoryCount: deletedsentMailsHistory.deletedCount,
      deletedCredsCount: deletedCreds.deletedCount,
      deletedBusinessUsersCount: deletedBusinessUsers.deletedCount,
      deletedAPIKEYSCount: deletedAPIKEYS.deletedCount,
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
