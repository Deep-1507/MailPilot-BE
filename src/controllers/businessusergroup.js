import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BusinessUserGroup from "../models/businessUsersGroup.js";

export const createBusinessUserGroup = async (req, res) => {
    try {
      const { groupName } = req.body;
  
      if (!groupName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Check if a group with the same name exists for this user
      const existingGroup = await BusinessUserGroup.findOne({
        createdByUserId: req.userId,
        groupName: groupName.trim(),
      });
  
      if (existingGroup) {
        return res.status(409).json({ message: "Group with this name already exists" });
      }
  
      // Create a new group
      const newBusinessUserGroup = await BusinessUserGroup.create({
        createdByUserId: req.userId,
        groupName: groupName.trim(),
      });
  
      res.status(201).json({
        message: "Business User Group created successfully",
        group: {
          id: newBusinessUserGroup._id,
          name: newBusinessUserGroup.groupName,
        },
      });
    } catch (error) {
      console.error("Error creating business group:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const getUserGroups = async (req, res) => {
    try {
      const userGroups = await BusinessUserGroup.find({ createdByUserId: req.userId });
  
      if (userGroups.length === 0) {
        return res.status(404).json({ message: "No groups found for this user" });
      }
  
      res.status(200).json({ groups: userGroups });
    } catch (error) {
      console.error("Error fetching user groups:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const getUserGroupsById = async (req, res) => {
    try {
      const userGroups = await BusinessUserGroup.find({ createdByUserId: req.userId });
  
      if (userGroups.length === 0) {
        return res.status(404).json({ message: "No groups found for this user" });
      }

      console.log(userGroups)

      const groupDetails = await BusinessUserGroup.findOne({_id:req.params.id,createdByUserId:req.userId});

      if (!groupDetails) {
        return res.status(404).json({ message: "Group not found or unauthorized" });
      }
  
      res.status(200).json({ group: groupDetails });
    } catch (error) {
      console.error("Error fetching user groups:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const addUsersToGroup = async (req, res) => {
    try {
      const { groupId } = req.params;
      const { users } = req.body;
  
      if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ message: "Invalid or empty users array" });
      }
  
      const group = await BusinessUserGroup.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      if (group.createdByUserId.toString() !== req.userId) {
        return res.status(403).json({ message: "Unauthorized action" });
      }
  
      // Ensure all users have name & email and prevent duplicates
      const newUsers = users.filter(user => user.name && user.email);
      const existingEmails = group.users.map(user => user.email);
      const filteredUsers = newUsers.filter(user => !existingEmails.includes(user.email));
  
      if (filteredUsers.length === 0) {
        return res.status(409).json({ message: "All users already exist in the group" });
      }
  
      group.users.push(...filteredUsers);
      await group.save();
  
      res.status(200).json({ message: "Users added successfully", group });
    } catch (error) {
      console.error("Error adding users to group:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  export const updateBusinessUserGroup = async (req, res) => {
    try {
      const { groupName } = req.body;
      const { groupId } = req.params;
  
      const group = await BusinessUserGroup.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      if (group.createdByUserId.toString() !== req.userId) {
        return res.status(403).json({ message: "Unauthorized action" });
      }
  
      group.groupName = groupName;
      await group.save();
  
      res.status(200).json({ message: "Group updated successfully", group });
    } catch (error) {
      console.error("Error updating group:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const deleteBusinessUserGroup = async (req, res) => {
    try {
      const { groupId } = req.params;
  
      const group = await BusinessUserGroup.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      if (group.createdByUserId.toString() !== req.userId) {
        return res.status(403).json({ message: "Unauthorized action" });
      }
  
      await BusinessUserGroup.findByIdAndDelete(groupId);
  
      res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
      console.error("Error deleting group:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  export const updateUserInGroup = async (req, res) => {
    try {
      const { groupId, userEmail } = req.params;
      const { name, email } = req.body;
  
      const group = await BusinessUserGroup.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      if (group.createdByUserId.toString() !== req.userId) {
        return res.status(403).json({ message: "Unauthorized action" });
      }
  
      const userIndex = group.users.findIndex(user => user.email === userEmail);
  
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found in the group" });
      }
  
      // Check if new email is already used by another user in the group
      if (email && email !== userEmail) {
        const emailExists = group.users.some(user => user.email === email);
        if (emailExists) {
          return res.status(409).json({ message: "User with this email already exists!" });
        }
        group.users[userIndex].email = email;
      }
  
      if (name) {
        group.users[userIndex].name = name;
      }
  
      await group.save();
  
      res.status(200).json({ message: "User updated successfully", user: group.users[userIndex] });
    } catch (error) {
      console.error("Error updating user in group:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  export const removeUserFromGroup = async (req, res) => {
    try {
      const { groupId, userEmail } = req.params;
  
      const group = await BusinessUserGroup.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      if (group.createdByUserId.toString() !== req.userId) {
        return res.status(403).json({ message: "Unauthorized action" });
      }
  
      const userIndex = group.users.findIndex(user => user.email === userEmail);
  
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found in the group" });
      }
  
      group.users.splice(userIndex, 1);
      await group.save();
  
      res.status(200).json({ message: "User removed from group successfully" });
    } catch (error) {
      console.error("Error removing user from group:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  