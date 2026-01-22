import express from "express";
import auth from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import { getUsers, getStats, deleteUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.use(auth);
router.use(authorize(["ADMIN"]));

router.get("/users", getUsers);
router.get("/stats", getStats);
router.delete("/users/:id", deleteUser);

export default router;
