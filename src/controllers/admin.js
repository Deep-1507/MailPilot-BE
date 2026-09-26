import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";

export const createAdmin = async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username , property:"admin"},
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: newAdmin._id,
        username: newAdmin.username,
      },
      token,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, username: admin.username,property:"admin"},
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: admin._id,
        username: admin.username,
      },
      token, // Send the token in response
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password"); // Exclude password
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAdminDetails = async (req, res) => {
  try {
    const admins = await Admin.findById(req.adminId).select("-password"); // Exclude password
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//yet to be done
export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    if (password) {
      return res
        .status(403)
        .json({ message: "Only user can edit their password" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

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
    let deletedAdmin;

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

