import Template from "../models/templateModel.js";
import Cred from "../models/credModel.js";
import { updateCred } from "./cred.js";

export const createTemplate = async (req, res) => {
  try {
    const {subject, template, comments } = req.body;

    if (!subject || !template) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTemplate = await Template.create({
      userID: req.userId,
      subject,
      template,
      comments
    });


    if (!updateCred) {
      return res.status(404).json({ message: "Credential not found" });
    }

    res.status(201).json({
      message: "Template created successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getTemplatesforAdmin = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(401).json({ message: "Unauthorized: Admin ID missing" });
    }
 
    const templates = await Template.find();

    if (!templates || templates.length === 0) {
      return res.status(404).json({ message: "No templates found" });
    }

    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getTemplates = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    const templates = await Template.find({userID:req.userId});
    console.log(templates)
    if(!templates){
      res.status(404).json({message:"No Templates found!"})
    }
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTemplatesByAdminForUser = async (req, res) => {
  try {

    if (!req.adminId) {
      return res.status(401).json({ message: "Unauthorized: Admin ID missing" });
    }
    const templates = await Template.find({userID:req.params.id});
  
    if(!templates){
      res.status(404).json({message:"No Templates found!"})
    }
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTemplate = async (req, res) => {
  try {

    const template = await Template.findById(req.params.id);

    if(!template){
      return res.status(404).json({ message: "Template not found" });
    }

    if (template.userID != req.userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: "Failed to update template" });
    }

    res.status(200).json({
      message: "Template updated successfully",
      template: updatedTemplate,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const deletedTemplate = await Template.findByIdAndDelete({
      _id:req.params.id,
      userId:req.userId
    });

    if (!deletedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const deleteTemplateByAdmin = async (req, res) => {
  try {
    const deletedTemplate = await Template.findByIdAndDelete({
      _id:req.params.id,
    });

    if (!deletedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
