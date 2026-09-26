import Cred from "../models/credModel.js";
import mongoose from "mongoose";

export const createCred = async (req, res) => {
  try {
    const { companyName, senderEmail, password, templateIds } = req.body;

    if (!companyName || !senderEmail || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingCred = await Cred.findOne({senderEmail});
    console.log(existingCred)

    if(existingCred){
      return res.status(409).json({message:"Credentials already present"})
    }

    const newCred = await Cred.create({
      userID: req.userId,
      companyName,
      senderEmail,
      password,
    });

    res.status(201).json({
      message: "Credential created successfully",
      cred: newCred,
    });
  } catch (error) {
    console.error("Error creating credential:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCreds = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const creds = await Cred.find({ userID:req.userId});

    console.log(creds)

    if (!creds || creds.length === 0) {
      return res.status(404).json({ message: "No credentials found" });
    }

    res.status(200).json(creds);
  } catch (error) {
    console.error("Error fetching credentials:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getCredsByAdmin = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const creds = await Cred.find({ userID:req.params.id}).select("-password");

    console.log(creds)

    if (!creds || creds.length === 0) {
      return res.status(404).json({ message: "No credentials found" });
    }

    res.status(200).json(creds);
  } catch (error) {
    console.error("Error fetching credentials:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllCredsByAdmin = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const creds = await Cred.find().select("-password");

    console.log(creds)

    if (!creds || creds.length === 0) {
      return res.status(404).json({ message: "No credentials found" });
    }

    res.status(200).json(creds);
  } catch (error) {
    console.error("Error fetching credentials:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getCredById = async (req, res) => {
  try {
    const cred = await Cred.findById(req.params.id);

    if (!cred) {
      return res.status(404).json({ message: "Credential not found" });
    }

    res.status(200).json(cred);
  } catch (error) {
    console.error("Error fetching credential:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCred = async (req, res) => {
  try { 

   const credential = await Cred.findById(req.params.id);
  //  console.log(credential)

   if(!credential){
    return res.status(404).json({ message: "Credential not found" });
   }

   if (credential.userID != req.userId) {
    return res.status(403).json({ message: "Unauthorized action" });
  }

  const updatedCred = await Cred.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

    if (!updatedCred) {
      return res.status(404).json({ message: "Failed to update credential" });
    }

    res.status(200).json({
      message: "Credential updated successfully",
      cred: updatedCred,
    });

  } catch (error) {
    console.error("Error updating credential:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteCred = async (req, res) => {
  try {
    const deletedCred = await Cred.findOneAndDelete({
      _id:req.params.id,
      userID:req.userId
    })

    if (!deletedCred) {
      return res.status(404).json({ message: "Credential not found" });
    }

    res.status(200).json({ message: "Credential deleted successfully" });
  } catch (error) {
    console.error("Error deleting credential:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
