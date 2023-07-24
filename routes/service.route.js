import express from "express";
import {
  createService,
  deleteService,
  getService,
  getServices,
  updateService
} from "../controllers/service.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createService);
router.delete("/:id", verifyToken, deleteService);
router.get("/single/:id", getService);
router.get("/", getServices);
router.put("/:id", verifyToken, updateService);

export default router;
