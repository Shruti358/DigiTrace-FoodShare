import mongoose from "mongoose";
import FoodRecord from "../models/FoodRecord.js";
import SurplusListing from "../models/SurplusListing.js";
import SurplusRequest from "../models/SurplusRequest.js";
import User from "../models/User.js";

const listingFields = [
  "title",
  "facilityId",
  "category",
  "quantityKg",
  "availableKg",
  "servings",
  "expiryWindow",
  "prepTime",
  "temp",
  "dietary",
  "pickupAddress",
  "safetyCertified",
  "haccpCode",
  "description",
];

const sendError = (response, status, message) =>
  response.status(status).json({ success: false, message });

const serializeRequest = (request) => ({
  requestId: request.requestId,
  surplusId: request.listingId,
  recordId: request.recordId,
  ngoName: request.ngoName,
  requestedKg: request.requestedKg,
  estimatedMeals: request.estimatedMeals,
  purpose: request.purpose,
  requestTime: request.requestTime,
  pickupWindow: request.pickupWindow,
  courier: request.courier,
  status: request.status,
});

const serializeListing = (listing, request = null) => ({
  id: listing.listingId,
  listingId: listing.listingId,
  recordId: listing.recordId,
  title: listing.title,
  provider: listing.provider,
  facilityId: listing.facilityId,
  category: listing.category,
  quantityKg: listing.quantityKg,
  availableKg: listing.availableKg,
  servings: listing.servings,
  expiryWindow: listing.expiryWindow,
  prepTime: listing.prepTime,
  temp: listing.temp,
  status: listing.status,
  dietary: listing.dietary,
  pickupAddress: listing.pickupAddress,
  safetyCertified: listing.safetyCertified,
  haccpCode: listing.haccpCode,
  description: listing.description,
  currentUserRequest: request ? serializeRequest(request) : null,
  createdAt: listing.createdAt,
  updatedAt: listing.updatedAt,
});

const isProviderOrAdmin = (request) => ["FOOD_PROVIDER", "ADMIN"].includes(request.user.role);

const validateListingUpdate = (body) => {
  const values = {};
  for (const field of listingFields) {
    if (Object.hasOwn(body, field)) values[field] = body[field];
  }

  if (Object.hasOwn(body, "status")) {
    if (!["Available", "Expired"].includes(body.status)) {
      return { error: "Status can only be changed to Available or Expired" };
    }
    values.status = body.status;
  }

  for (const field of ["title", "facilityId", "category", "expiryWindow", "prepTime", "temp", "pickupAddress", "haccpCode", "description"]) {
    if (Object.hasOwn(values, field)) {
      if (typeof values[field] !== "string" || !values[field].trim()) {
        return { error: `${field} must be non-empty text` };
      }
      values[field] = values[field].trim();
    }
  }

  for (const field of ["quantityKg", "availableKg", "servings"]) {
    if (Object.hasOwn(values, field)) {
      const number = Number(values[field]);
      if (!Number.isFinite(number) || number < 0 || (field === "quantityKg" && number === 0)) {
        return { error: `${field} must be a valid non-negative quantity${field === "quantityKg" ? " greater than zero" : ""}` };
      }
      values[field] = number;
    }
  }

  if (Object.hasOwn(values, "dietary")) {
    if (!Array.isArray(values.dietary) || values.dietary.some((tag) => typeof tag !== "string")) {
      return { error: "dietary must be an array of text tags" };
    }
  }

  if (Object.hasOwn(values, "safetyCertified") && typeof values.safetyCertified !== "boolean") {
    return { error: "safetyCertified must be a boolean" };
  }

  return { values };
};

const findAuthorizedListing = async (request, response) => {
  const listing = await SurplusListing.findOne({ listingId: request.params.listingId });
  if (!listing) {
    sendError(response, 404, "Surplus listing not found");
    return null;
  }
  if (!isProviderOrAdmin(request)) {
    sendError(response, 403, "Your role cannot manage surplus listings");
    return null;
  }
  if (request.user.role !== "ADMIN" && listing.owner.toString() !== request.user.userId) {
    sendError(response, 404, "Surplus listing not found");
    return null;
  }
  return listing;
};

export const createSurplusListing = async (request, response, next) => {
  if (!isProviderOrAdmin(request)) return sendError(response, 403, "Only food providers can post surplus listings");

  const { recordId } = request.body || {};
  if (typeof recordId !== "string" || !recordId.trim()) {
    return sendError(response, 400, "recordId is required");
  }

  try {
    const recordFilter = { recordId: recordId.trim() };
    if (request.user.role !== "ADMIN") recordFilter.owner = request.user.userId;
    const record = await FoodRecord.findOne(recordFilter);
    if (!record) return sendError(response, 404, "Food record not found");
    if (!Number.isFinite(record.surplus) || record.surplus <= 0) {
      return sendError(response, 400, "Food record must have a positive surplus quantity");
    }

    let quantityKg = record.surplus;
    if (request.body.quantityKg !== undefined) {
      quantityKg = Number(request.body.quantityKg);
      if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
        return sendError(response, 400, "quantityKg must be a finite positive number");
      }
      if (quantityKg > record.surplus) {
        return sendError(response, 400, "Listing quantity cannot exceed the food record surplus");
      }
    }

    const existing = await SurplusListing.findOne({ foodRecord: record._id });
    if (existing) {
      return response.status(200).json({
        success: true,
        message: "Surplus listing already exists",
        data: { listing: serializeListing(existing) },
      });
    }

    const user = await User.findById(record.owner);
    if (!user) return sendError(response, 404, "Food provider not found");

    const requestedCategory = typeof request.body.category === "string" ? request.body.category.trim() : "";
    const categoryAliases = { Rice: "Grains", Vegetables: "Salad" };
    const category = requestedCategory || categoryAliases[record.foodCategory] || record.foodCategory;
    const listingData = {
      foodRecord: record._id,
      recordId: record.recordId,
      owner: record.owner,
      title: record.itemName,
      provider: user.organizationName || user.name,
      facilityId: "NODE-04",
      category,
      quantityKg,
      availableKg: quantityKg,
      servings: Math.round(quantityKg * 2.5),
      expiryWindow: "03h 00m",
      prepTime: `${record.date} at ${record.time}`,
      temp: "38°F (Chilled)",
      status: "Available",
      dietary: ["HACCP Insured", "Fresh Prep"],
      pickupAddress: user.address || "Loading Dock #2",
      safetyCertified: false,
      haccpCode: "Pending Verification",
      description: `Fresh surplus from ${record.mealType} food record ${record.recordId}.`,
    };

    const listing = await SurplusListing.create(listingData);
    return response.status(201).json({
      success: true,
      message: "Surplus listing created",
      data: { listing: serializeListing(listing) },
    });
  } catch (error) {
    if (error.code === 11000) {
      const existing = await SurplusListing.findOne({ recordId: request.body.recordId.trim() });
      if (existing && existing.owner.toString() === request.user.userId) {
        return response.status(200).json({
          success: true,
          message: "Surplus listing already exists",
          data: { listing: serializeListing(existing) },
        });
      }
      return sendError(response, 409, "A surplus listing already exists for this food record");
    }
    return next(error);
  }
};

export const listSurplusListings = async (request, response, next) => {
  try {
    const listings = await SurplusListing.find().sort({ createdAt: -1 });
    return response.status(200).json({
      success: true,
      data: { listings: listings.map((listing) => serializeListing(listing)) },
    });
  } catch (error) {
    return next(error);
  }
};

export const getSurplusListing = async (request, response, next) => {
  try {
    const listing = await SurplusListing.findOne({ listingId: request.params.listingId });
    if (!listing) return sendError(response, 404, "Surplus listing not found");

    const isOwner = listing.owner.toString() === request.user.userId;
    const activeRequest = await SurplusRequest.findOne({
      listing: listing._id,
      status: { $in: ["Pending", "Accepted", "Pickup Scheduled"] },
    });
    const visibleRequest = isOwner || activeRequest?.requester.toString() === request.user.userId
      ? activeRequest
      : null;

    return response.status(200).json({
      success: true,
      data: { listing: serializeListing(listing, visibleRequest) },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateSurplusListing = async (request, response, next) => {
  try {
    const listing = await findAuthorizedListing(request, response);
    if (!listing) return;

    const { values, error } = validateListingUpdate(request.body || {});
    if (error) return sendError(response, 400, error);
    if (Object.keys(values).length === 0) return sendError(response, 400, "No listing fields provided");

    if (values.quantityKg !== undefined && values.availableKg === undefined && values.quantityKg < listing.availableKg) {
      return sendError(response, 400, "quantityKg cannot be lower than availableKg");
    }
    const nextQuantity = values.quantityKg ?? listing.quantityKg;
    const nextAvailable = values.availableKg ?? listing.availableKg;
    if (nextAvailable > nextQuantity) return sendError(response, 400, "availableKg cannot exceed quantityKg");
    if (values.status === "Available" && nextAvailable <= 0) {
      return sendError(response, 400, "An Available listing must have availableKg greater than zero");
    }

    const nextStatus = values.status;
    Object.assign(listing, values);
    await listing.save();

    if (nextStatus === "Available" || nextStatus === "Expired") {
      await SurplusRequest.updateMany(
        { listing: listing._id, status: { $in: ["Pending", "Accepted", "Pickup Scheduled"] } },
        { $set: { status: "Cancelled" } }
      );
    }

    return response.status(200).json({
      success: true,
      message: "Surplus listing updated",
      data: { listing: serializeListing(listing) },
    });
  } catch (error) {
    return next(error);
  }
};

export const requestSurplusListing = async (request, response, next) => {
  if (request.user.role !== "NGO") return sendError(response, 403, "Only NGOs can request surplus listings");

  const requestedKg = Number(request.body?.requestedKg);
  const { purpose, pickupWindow, courier } = request.body || {};
  if (!Number.isFinite(requestedKg) || requestedKg <= 0) {
    return sendError(response, 400, "requestedKg must be a finite quantity greater than zero");
  }
  for (const [field, value] of Object.entries({ purpose, pickupWindow, courier })) {
    if (typeof value !== "string" || !value.trim()) return sendError(response, 400, `${field} is required`);
  }

  try {
    const listing = await SurplusListing.findOne({ listingId: request.params.listingId });
    if (!listing) return sendError(response, 404, "Surplus listing not found");
    if (listing.owner.toString() === request.user.userId) {
      return sendError(response, 403, "Providers cannot request their own listings");
    }
    if (listing.status !== "Available" || listing.availableKg <= 0) {
      return sendError(response, 409, "This surplus listing is no longer available");
    }
    if (requestedKg > listing.availableKg) {
      return sendError(response, 400, "requestedKg cannot exceed the available listing quantity");
    }

    const ngo = await User.findById(request.user.userId);
    if (!ngo) return sendError(response, 401, "Authenticated NGO account not found");

    const surplusRequest = await SurplusRequest.create({
      listing: listing._id,
      listingId: listing.listingId,
      recordId: listing.recordId,
      provider: listing.owner,
      requester: ngo._id,
      ngoName: ngo.organizationName || ngo.name,
      requestedKg,
      estimatedMeals: Math.round(requestedKg * 2.4),
      purpose: purpose.trim(),
      requestTime: `Today at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      pickupWindow: pickupWindow.trim(),
      courier: courier.trim(),
      status: "Pending",
    });

    const claimedListing = await SurplusListing.findOneAndUpdate(
      { _id: listing._id, status: "Available", availableKg: { $gte: requestedKg } },
      { $set: { status: "Requested" } },
      { new: true, runValidators: true }
    );

    if (!claimedListing) {
      await SurplusRequest.deleteOne({ _id: surplusRequest._id });
      return sendError(response, 409, "This surplus listing is no longer available");
    }

    return response.status(201).json({
      success: true,
      message: "Surplus request submitted",
      data: {
        listing: serializeListing(claimedListing, surplusRequest),
        request: serializeRequest(surplusRequest),
      },
    });
  } catch (error) {
    if (error.code === 11000) return sendError(response, 409, "An active request already exists for this listing");
    if (error instanceof mongoose.Error.ValidationError) return sendError(response, 400, error.message);
    return next(error);
  }
};

export { isProviderOrAdmin };