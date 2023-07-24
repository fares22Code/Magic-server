import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm ,updateOrderById} from "../controllers/order.controller.js";

const router = express.Router();

// router.post("/:serviceId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, confirm);
router.put("/:id", verifyToken, updateOrderById);

export default router;
