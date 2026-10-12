import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import FoodRecord from "../models/FoodRecord.js";
import SurplusListing from "../models/SurplusListing.js";
import SurplusRequest from "../models/SurplusRequest.js";
import User from "../models/User.js";

const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000/api";
const testSuffix = randomUUID();
const testUsers = [];
let provider;
let otherProvider;
let ngo;
let providerToken;
let otherProviderToken;
let ngoToken;
let foodRecord;

const createTestUser = async (role, label) => {
  const user = await User.create({
    name: `Surplus ${label}`,
    email: `surplus-${label.toLowerCase()}-${testSuffix}@example.invalid`,
    password: "DigiTrace-Test@2026",
    role,
    organizationName: `Surplus ${label} Organization`,
    address: "Integration Test Dock",
  });
  testUsers.push(user);
  return user;
};

const createToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

const request = (path, { token, ...options } = {}) => {
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body) headers.set("Content-Type", "application/json");

  return fetch(`${apiBaseUrl}${path}`, { ...options, headers });
};

const requestPayload = (requestedKg = 4) => ({
  requestedKg,
  purpose: "Surplus integration test meal service",
  pickupWindow: "12:00 PM - 01:00 PM",
  courier: "Integration Test Van",
});

before(async () => {
  assert.ok(process.env.MONGO_URI, "MONGO_URI must be configured for integration tests");
  assert.ok(process.env.JWT_SECRET, "JWT_SECRET must be configured for integration tests");
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.init(), FoodRecord.init(), SurplusListing.init(), SurplusRequest.init()]);

  provider = await createTestUser("FOOD_PROVIDER", "Provider");
  otherProvider = await createTestUser("FOOD_PROVIDER", "OtherProvider");
  ngo = await createTestUser("NGO", "NGO");
  providerToken = createToken(provider);
  otherProviderToken = createToken(otherProvider);
  ngoToken = createToken(ngo);

  foodRecord = await FoodRecord.create({
    owner: provider._id,
    date: "2026-10-12",
    time: "11:30 AM",
    station: "Integration Test Kitchen",
    mealType: "Lunch",
    foodCategory: "Proteins",
    itemName: `Integration surplus ${testSuffix}`,
    foodPrepared: 20,
    foodConsumed: 8,
    surplus: 10,
    waste: 2,
    status: "Available",
  });
});

after(async () => {
  if (testUsers.length) {
    const ownerIds = testUsers.map((user) => user._id);
    const listings = await SurplusListing.find({ owner: { $in: ownerIds } }).select("_id");
    await SurplusRequest.deleteMany({
      $or: [{ listing: { $in: listings.map((listing) => listing._id) } }, { requester: { $in: ownerIds } }],
    });
    await SurplusListing.deleteMany({ owner: { $in: ownerIds } });
    await FoodRecord.deleteMany({ owner: { $in: ownerIds } });
    await User.deleteMany({ _id: { $in: ownerIds } });
  }
  await mongoose.disconnect();
});

test("surplus listing CRUD, owner/role permissions, request availability, duplicates, and quantity validation", async () => {
  const anonymousResponse = await request("/surplus-listings");
  assert.equal(anonymousResponse.status, 401);

  const ngoFoodRecordRequests = [];
  ngoFoodRecordRequests.push(await request("/food-records", { token: ngoToken }));
  ngoFoodRecordRequests.push(await request(`/food-records/${foodRecord.recordId}`, { token: ngoToken }));
  ngoFoodRecordRequests.push(await request("/food-records", {
    token: ngoToken,
    method: "POST",
    body: JSON.stringify({ itemName: "NGO must not create food records" }),
  }));
  ngoFoodRecordRequests.push(await request(`/food-records/${foodRecord.recordId}`, {
    token: ngoToken,
    method: "PUT",
    body: JSON.stringify({ itemName: "NGO must not edit food records" }),
  }));
  ngoFoodRecordRequests.push(await request(`/food-records/${foodRecord.recordId}`, {
    token: ngoToken,
    method: "DELETE",
  }));
  assert.deepEqual(ngoFoodRecordRequests.map((response) => response.status), [403, 403, 403, 403, 403]);

  const providerFoodRecords = await request("/food-records", { token: providerToken });
  assert.equal(providerFoodRecords.status, 200);

  const ngoCreateResponse = await request("/surplus-listings", {
    token: ngoToken,
    method: "POST",
    body: JSON.stringify({ recordId: foodRecord.recordId }),
  });
  assert.equal(ngoCreateResponse.status, 403);

  const invalidZeroQuantity = await request("/surplus-listings", {
    token: providerToken,
    method: "POST",
    body: JSON.stringify({ recordId: foodRecord.recordId, quantityKg: 0 }),
  });
  assert.equal(invalidZeroQuantity.status, 400);

  const invalidExcessQuantity = await request("/surplus-listings", {
    token: providerToken,
    method: "POST",
    body: JSON.stringify({ recordId: foodRecord.recordId, quantityKg: 11 }),
  });
  assert.equal(invalidExcessQuantity.status, 400);

  const createResponse = await request("/surplus-listings", {
    token: providerToken,
    method: "POST",
    body: JSON.stringify({ recordId: foodRecord.recordId, quantityKg: 8 }),
  });
  assert.equal(createResponse.status, 201);
  const createdListing = (await createResponse.json()).data.listing;
  assert.equal(createdListing.quantityKg, 8);
  assert.equal(createdListing.status, "Available");
  assert.equal(Object.hasOwn(createdListing, "owner"), false);

  const repeatCreate = await request("/surplus-listings", {
    token: providerToken,
    method: "POST",
    body: JSON.stringify({ recordId: foodRecord.recordId }),
  });
  assert.equal(repeatCreate.status, 200);

  const listResponse = await request("/surplus-listings", { token: ngoToken });
  assert.equal(listResponse.status, 200);
  assert.ok((await listResponse.json()).data.listings.some((listing) => listing.listingId === createdListing.listingId));

  const getResponse = await request(`/surplus-listings/${createdListing.listingId}`, { token: ngoToken });
  assert.equal(getResponse.status, 200);

  const updateResponse = await request(`/surplus-listings/${createdListing.listingId}`, {
    token: providerToken,
    method: "PUT",
    body: JSON.stringify({ description: "Updated integration listing" }),
  });
  assert.equal(updateResponse.status, 200);
  assert.equal((await updateResponse.json()).data.listing.description, "Updated integration listing");

  const otherOwnerUpdate = await request(`/surplus-listings/${createdListing.listingId}`, {
    token: otherProviderToken,
    method: "PUT",
    body: JSON.stringify({ description: "Unauthorized edit" }),
  });
  assert.equal(otherOwnerUpdate.status, 404);

  const invalidUpdate = await request(`/surplus-listings/${createdListing.listingId}`, {
    token: providerToken,
    method: "PUT",
    body: JSON.stringify({ quantityKg: -1 }),
  });
  assert.equal(invalidUpdate.status, 400);

  const providerRequest = await request(`/surplus-listings/${createdListing.listingId}/requests`, {
    token: providerToken,
    method: "POST",
    body: JSON.stringify(requestPayload()),
  });
  assert.equal(providerRequest.status, 403);

  const expireResponse = await request(`/surplus-listings/${createdListing.listingId}`, {
    token: providerToken,
    method: "PUT",
    body: JSON.stringify({ status: "Expired" }),
  });
  assert.equal(expireResponse.status, 200);

  const unavailableRequest = await request(`/surplus-listings/${createdListing.listingId}/requests`, {
    token: ngoToken,
    method: "POST",
    body: JSON.stringify(requestPayload()),
  });
  assert.equal(unavailableRequest.status, 409);

  const reopenResponse = await request(`/surplus-listings/${createdListing.listingId}`, {
    token: providerToken,
    method: "PUT",
    body: JSON.stringify({ status: "Available" }),
  });
  assert.equal(reopenResponse.status, 200);

  const invalidRequestQuantity = await request(`/surplus-listings/${createdListing.listingId}/requests`, {
    token: ngoToken,
    method: "POST",
    body: JSON.stringify(requestPayload(9)),
  });
  assert.equal(invalidRequestQuantity.status, 400);

  const submitRequest = await request(`/surplus-listings/${createdListing.listingId}/requests`, {
    token: ngoToken,
    method: "POST",
    body: JSON.stringify(requestPayload(4)),
  });
  assert.equal(submitRequest.status, 201);
  const requestData = (await submitRequest.json()).data.request;
  assert.equal(requestData.status, "Pending");

  const duplicateRequest = await request(`/surplus-listings/${createdListing.listingId}/requests`, {
    token: ngoToken,
    method: "POST",
    body: JSON.stringify(requestPayload(2)),
  });
  assert.equal(duplicateRequest.status, 409);

  const refreshedListing = await request(`/surplus-listings/${createdListing.listingId}`, { token: ngoToken });
  const refreshed = (await refreshedListing.json()).data.listing;
  assert.equal(refreshed.status, "Requested");
  assert.equal(refreshed.currentUserRequest.status, "Pending");
});