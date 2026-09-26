import BusinessUser from "../models/businessUsers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createBusinessUser = async (req, res) => {
  try {
    const { email, name} = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const AllUsers = await BusinessUser.find({createdByUserId:req.userId});

    const existingUsers = AllUsers.filter(user => user.email === email);

    if(existingUsers.length>0){
        return res.status(403).json({message:"User already existes"})
    }

    const newBusinessUser = await BusinessUser.create({
      createdByUserId:req.userId,
      email,
      name
    });

    res.status(201).json({
      message: "Business User created successfully",
      user: {
        id: newBusinessUser._id,
        email: newBusinessUser.email,
        name: newBusinessUser.name,
      },
    });
  } catch (error) {
    console.error("Error creating business user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBusinessUsers = async (req, res) => {
  try {
    const users = await BusinessUser.find({createdByUserId:req.userId})
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBusinessUsersforAdmin = async (req, res) => {
  try {
    const users = await BusinessUser.find({createdByUserId:req.params.id})
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBusinessUser = async (req, res) => {
  try { 
    const user = await BusinessUser.findById(req.params.id);

    if(!user){
      return res.status(404).json({ message: "User not found" });
     }
  
     if (user.createdByUserId!= req.userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if(user.email != req.body.email){
      const checkIfExisting = await BusinessUser.find({ email: req.body.email });

      if(checkIfExisting.length>0){
        return res.status(409).json({message:"User with this email alredy exist!"})
      }
    }

  const updatedUser = await BusinessUser.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

    if (!updatedUser) {
      return res.status(404).json({ message: "Failed to update user" });
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


export const deleteBusinessUser = async (req, res) => {
  try {
    const deletedUser = await BusinessUser.findOneAndDelete({
      _id:req.params.id,
      createdByUserId:req.userId
    })

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






export const getUserByAdmin = async (req, res) => {
  try {
    const user = await BusinessUser.findById(req.params.id);

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

export const deleteUserByAdmin = async (req, res) => {
  try {
    let deletedUser;

    deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
