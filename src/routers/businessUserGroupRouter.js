import { Router } from "express";
import {  createBusinessUserGroup, 
    updateBusinessUserGroup, 
    deleteBusinessUserGroup, 
    updateUserInGroup, 
    removeUserFromGroup,
    getUserGroups,
    getUserGroupsById,
    addUsersToGroup  } from "../controllers/businessusergroup.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { adminauthMiddleware } from "../middlewares/adminauthmiddleware.js";

const router = Router();



router.post("/", authMiddleware, createBusinessUserGroup);
router.post("/groups/:groupId/users", authMiddleware, addUsersToGroup);
router.put("/groups/:groupId", authMiddleware, updateBusinessUserGroup);
router.delete("/groups/:groupId", authMiddleware, deleteBusinessUserGroup);
router.put("/groups/:groupId/users/:userEmail", authMiddleware, updateUserInGroup);
router.delete("/groups/:groupId/users/:userEmail", authMiddleware, removeUserFromGroup);
router.get("/groups", authMiddleware, getUserGroups);
router.get("/groups/:id", authMiddleware, getUserGroupsById);


export default router;
