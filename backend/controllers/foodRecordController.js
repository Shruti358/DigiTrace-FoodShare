import { randomUUID } from "node:crypto";
import FoodRecord from "../models/FoodRecord.js";

const editableFields = [
  "date",
  "time",
  "station",
  "mealType",
  "foodCategory",
  "itemName",
  "foodPrepared",
  "foodConsumed",
  "surplus",
  "waste",
  "wasteType",
  "wasteReason",
  "handlingStream",
  "kitchenNotes",
];

const statusStyles = {
  Consumed: "bg-surface-container-low text-primary",
  Available: "bg-emerald-100 text-emerald-800",
  Composted: "bg-primary-fixed text-on-primary-fixed",
  Requested: "bg-amber-100 text-amber-900",
  "Pickup Scheduled": "bg-blue-100 text-blue-900",
  "Picked Up": "bg-purple-100 text-purple-900",
  Received: "bg-teal-100 text-teal-900",
  Completed: "bg-tertiary-fixed text-on-tertiary-fixed",
  Distributed: "bg-secondary-container text-on-secondary-container",
  Expired: "bg-gray-200 text-gray-700",
};

const sendError = (response, status, message) =>
  response.status(status).json({ success: false, message });

const serializeRecord = (record) => {
  const data = record.toObject ? record.toObject() : record;
  delete data.owner;
  return { ...data, statusBg: statusStyles[data.status] || "bg-gray-100 text-gray-800" };
};

const ownerFilter = (request) =>
  request.user.role === "ADMIN" ? {} : { owner: request.user.userId };

const normalizeAndValidate = (input, { partial = false } = {}) => {
  const values = {};
  for (const field of editableFields) {
    if (Object.hasOwn(input, field)) values[field] = input[field];
  }

  const errors = [];
  if (!partial || Object.hasOwn(values, "date")) {
    if (typeof values.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
      errors.push("Date must be in YYYY-MM-DD format");
    } else {
      const parsedDate = new Date(`${values.date}T00:00:00.000Z`);
      if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== values.date) {
        errors.push("Date must be a valid calendar date");
      }
    }
  }

  for (const field of ["mealType", "foodCategory", "itemName"]) {
    if (!partial || Object.hasOwn(values, field)) {
      if (typeof values[field] !== "string" || !values[field].trim()) {
        errors.push(`${field} is required`);
      } else {
        values[field] = values[field].trim();
      }
    }
  }

  for (const field of ["foodPrepared", "foodConsumed", "surplus", "waste"]) {
    if (!partial || Object.hasOwn(values, field)) {
      const value = Number(values[field]);
      if (values[field] === "" || !Number.isFinite(value) || value < 0) {
        errors.push(`${field} must be a finite non-negative quantity`);
      } else {
        values[field] = value;
      }
    }
  }

  if (!partial || Object.hasOwn(values, "station")) {
    values.station = typeof values.station === "string" && values.station.trim()
      ? values.station.trim()
      : "Station #4 Line Alpha";
  }

  for (const field of ["time", "wasteType", "wasteReason", "handlingStream", "kitchenNotes"]) {
    if (Object.hasOwn(values, field) && typeof values[field] !== "string") {
      errors.push(`${field} must be text`);
    }
  }

  if (errors.length === 0) {
    const prepared = Number(input.foodPrepared);
    const consumed = Number(input.foodConsumed);
    const surplus = Number(input.surplus);
    const waste = Number(input.waste);

    if (consumed > prepared) errors.push("Food consumed cannot exceed food prepared");
    if (surplus + waste > prepared - consumed + 0.01) {
      errors.push("Surplus plus waste cannot exceed the remaining unconsumed food");
    }
  }

  return { values, errors };
};

const statusFor = ({ surplus, waste }) => {
  if (surplus > 0) return "Available";
  if (waste > 0) return "Composted";
  return "Consumed";
};

const requireFoodRecordRole = (request, response, next) => {
  if (!["FOOD_PROVIDER", "ADMIN"].includes(request.user.role)) {
    return sendError(response, 403, "Your role cannot access food records");
  }
  return next();
};

export const createFoodRecord = async (request, response, next) => {
  const { values, errors } = normalizeAndValidate(request.body || {});
  if (errors.length) return sendError(response, 400, errors[0]);

  try {
    const record = await FoodRecord.create({
      ...values,
      time: values.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      recordId: `DT-F-${randomUUID().slice(0, 12).toUpperCase()}`,
      status: statusFor(values),
      owner: request.user.userId,
    });

    return response.status(201).json({
      success: true,
      message: "Food record created",
      data: { record: serializeRecord(record) },
    });
  } catch (error) {
    return next(error);
  }
};

export const listFoodRecords = async (request, response, next) => {
  try {
    const records = await FoodRecord.find(ownerFilter(request)).sort({ createdAt: -1 });
    return response.status(200).json({
      success: true,
      data: { records: records.map(serializeRecord) },
    });
  } catch (error) {
    return next(error);
  }
};

export const getFoodRecord = async (request, response, next) => {
  try {
    const record = await FoodRecord.findOne({ recordId: request.params.recordId, ...ownerFilter(request) });
    if (!record) return sendError(response, 404, "Food record not found");

    return response.status(200).json({ success: true, data: { record: serializeRecord(record) } });
  } catch (error) {
    return next(error);
  }
};

export const updateFoodRecord = async (request, response, next) => {
  try {
    const record = await FoodRecord.findOne({ recordId: request.params.recordId, ...ownerFilter(request) });
    if (!record) return sendError(response, 404, "Food record not found");

    const { values, errors } = normalizeAndValidate({ ...record.toObject(), ...(request.body || {}) });
    if (errors.length) return sendError(response, 400, errors[0]);

    Object.assign(record, values, { status: statusFor(values) });
    await record.save();

    return response.status(200).json({
      success: true,
      message: "Food record updated",
      data: { record: serializeRecord(record) },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteFoodRecord = async (request, response, next) => {
  try {
    const record = await FoodRecord.findOneAndDelete({
      recordId: request.params.recordId,
      ...ownerFilter(request),
    });
    if (!record) return sendError(response, 404, "Food record not found");

    return response.status(200).json({ success: true, message: "Food record deleted" });
  } catch (error) {
    return next(error);
  }
};

export { requireFoodRecordRole };