import { Router } from "express";
import {
  createSurplusListing,
  getSurplusListing,
  listSurplusListings,
  requestSurplusListing,
  updateSurplusListing,
} from "../controllers/surplusListingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.get("/", listSurplusListings);
router.post("/", createSurplusListing);
router.get("/:listingId", getSurplusListing);
router.put("/:listingId", updateSurplusListing);
router.post("/:listingId/requests", requestSurplusListing);

export default router;