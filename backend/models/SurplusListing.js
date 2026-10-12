import { randomUUID } from "node:crypto";
import mongoose from "mongoose";

const listingStatuses = [
  "Available",
  "Requested",
  "Pickup Scheduled",
  "Picked Up",
  "Received",
  "Distributed",
  "Completed",
  "Expired",
];

const surplusListingSchema = new mongoose.Schema(
  {
    listingId: {
      type: String,
      required: true,
      unique: true,
      default: () => `SRP-${randomUUID().slice(0, 12).toUpperCase()}`,
    },
    foodRecord: { type: mongoose.Schema.Types.ObjectId, ref: "FoodRecord", required: true, unique: true },
    recordId: { type: String, required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    facilityId: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantityKg: { type: Number, required: true, min: 0, validate: Number.isFinite },
    availableKg: { type: Number, required: true, min: 0, validate: Number.isFinite },
    servings: { type: Number, required: true, min: 0 },
    expiryWindow: { type: String, required: true, trim: true },
    prepTime: { type: String, required: true, trim: true },
    temp: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: listingStatuses, default: "Available" },
    dietary: { type: [String], default: [] },
    pickupAddress: { type: String, required: true, trim: true },
    safetyCertified: { type: Boolean, default: false },
    haccpCode: { type: String, default: "Pending Verification", trim: true },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

surplusListingSchema.path("quantityKg").validate((value) => value > 0, "quantityKg must be greater than zero");
surplusListingSchema.path("availableKg").validate(function (value) {
  return value <= this.quantityKg;
}, "availableKg cannot exceed quantityKg");

const SurplusListing = mongoose.model("SurplusListing", surplusListingSchema);

export { listingStatuses };
export default SurplusListing;