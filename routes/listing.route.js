import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createListing,
  deleteListing,
  getAllListing,
  getSingleListing,
  updateListing,
  getSearchListing,
} from "../controller/listing.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/get-listings", getAllListing);
router.get("/search", getSearchListing);
router.get("/get-listing/:id", getSingleListing);
router.get("/get-single-listing/:id",verifyToken, getSingleListing);
router.put("/update-listing/:id",verifyToken,  updateListing);
router.delete("/delete-listing/:id", verifyToken, deleteListing);

export default router;
