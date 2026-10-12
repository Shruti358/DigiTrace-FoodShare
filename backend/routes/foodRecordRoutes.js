import { Router } from "express";
import {
  createFoodRecord,
  deleteFoodRecord,
  getFoodRecord,
  listFoodRecords,
  requireFoodRecordRole,
  updateFoodRecord,
} from "../controllers/foodRecordController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware, requireFoodRecordRole);
router.post("/", createFoodRecord);
router.get("/", listFoodRecords);
router.get("/:recordId", getFoodRecord);
router.put("/:recordId", updateFoodRecord);
router.delete("/:recordId", deleteFoodRecord);

export default router;