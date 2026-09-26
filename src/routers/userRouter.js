import { Router } from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUserByAdmin,
  updateUser,
  deleteUser,
  deleteUserByAdmin,
  getUser,
  updateUserByAdmin,
} from "../controllers/user.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { adminauthMiddleware } from "../middlewares/adminauthmiddleware.js";

const router = Router();

router.post("/signup", createUser);
router.post("/signin", loginUser);


router.get("/getuserdetail", authMiddleware, getUser);
router.put("/", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

//only for admin
router.get("/admin", adminauthMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserByAdmin);
router.put("/:id", authMiddleware, updateUserByAdmin);
router.delete("/admin/:id", adminauthMiddleware, deleteUserByAdmin);

export default router;
