import { randomUUID } from "node:crypto";
import mongoose from "mongoose";

const activeStatuses = ["Pending", "Accepted", "Pickup Scheduled"];

const surplusRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      default: () => `REQ-${randomUUID().slice(0, 12).toUpperCase()}`,
    },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "SurplusListing", required: true },
    listingId: { type: String, required: true },
    recordId: { type: String, required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ngoName: { type: String, required: true, trim: true },
    requestedKg: { type: Number, required: true, min: 0, validate: Number.isFinite },
    estimatedMeals: { type: Number, required: true, min: 0 },
    purpose: { type: String, required: true, trim: true },
    requestTime: { type: String, required: true },
    pickupWindow: { type: String, required: true, trim: true },
    courier: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Accepted", "Rejected", "Pickup Scheduled", "Picked Up", "Received", "Distributed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

surplusRequestSchema.index(
  { listing: 1 },
  {
    unique: true,
    name: "unique_active_surplus_request_per_listing",
    partialFilterExpression: { status: { $in: activeStatuses } },
  }
);

surplusRequestSchema.path("requestedKg").validate((value) => value > 0, "requestedKg must be greater than zero");

const SurplusRequest = mongoose.model("SurplusRequest", surplusRequestSchema);

export default SurplusRequest;