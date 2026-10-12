import { randomUUID } from "node:crypto";
import mongoose from "mongoose";

const foodRecordSchema = new mongoose.Schema(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
      default: () => `DT-F-${randomUUID().slice(0, 12).toUpperCase()}`,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    station: { type: String, required: true, trim: true },
    mealType: { type: String, required: true, trim: true },
    foodCategory: { type: String, required: true, trim: true },
    itemName: { type: String, required: true, trim: true },
    foodPrepared: { type: Number, required: true, min: 0 },
    foodConsumed: { type: Number, required: true, min: 0 },
    surplus: { type: Number, required: true, min: 0 },
    waste: { type: Number, required: true, min: 0 },
    wasteType: { type: String, trim: true },
    wasteReason: { type: String, trim: true },
    handlingStream: { type: String, trim: true },
    kitchenNotes: { type: String, trim: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const FoodRecord = mongoose.model("FoodRecord", foodRecordSchema);

export default FoodRecord;