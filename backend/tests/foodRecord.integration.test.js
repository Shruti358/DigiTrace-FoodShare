import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import FoodRecord from "../models/FoodRecord.js";
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
let createdRecordId;

const createTestUser = async (role, name) => {
  const user = await User.create({
    name,
    email: `food-record-${role.toLowerCase()}-${testUsers.length}-${testSuffix}@example.invalid`,
    password: "DigiTrace-Test@2026",
    role,
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

before(async () => {
  assert.ok(process.env.MONGO_URI, "MONGO_URI must be configured for integration tests");
  assert.ok(process.env.JWT_SECRET, "JWT_SECRET must be configured for integration tests");
  await mongoose.connect(process.env.MONGO_URI);
  provider = await createTestUser("FOOD_PROVIDER", "Food Record Integration Provider");
  otherProvider = await createTestUser("FOOD_PROVIDER", "Food Record Other Provider");
  ngo = await createTestUser("NGO", "Food Record Integration NGO");
  providerToken = createToken(provider);
  otherProviderToken = createToken(otherProvider);
  ngoToken = createToken(ngo);
});

after(async () => {
  if (testUsers.length) {
    const ownerIds = testUsers.map((user) => user._id);
    await FoodRecord.deleteMany({ owner: { $in: ownerIds } });
    await User.deleteMany({ _id: { $in: ownerIds } });
  }
  await mongoose.disconnect();
});

test("authenticated food-record create, list, retrieve, update, delete, ownership and validation", async () => {
  const unauthorizedResponse = await request("/food-records");
  assert.equal(unauthorizedResponse.status, 401);

  const ngoResponse = await request("/food-records", { token: ngoToken });
  assert.equal(ngoResponse.status, 403);

  const invalidResponse = await request("/food-records", {
    token: providerToken,
    method: "POST",
    body: JSON.stringify({
      date: "2026-10-12",
      mealType: "Lunch",
      foodCategory: "Rice",
      itemName: "Invalid mass balance",
      foodPrepared: 100,
      foodConsumed: 80,
      surplus: 15,
      waste: 10,
    }),
  });
  assert.equal(invalidResponse.status, 400);

  const createResponse = await request("/food-records", {
    token: providerToken,
    method: "POST",
    body: JSON.stringify({
      date: "2026-10-12",
      mealType: "Lunch",
      foodCategory: "Rice",
      itemName: `Integration record ${testSuffix}`,
      foodPrepared: 100,
      foodConsumed: 60,
      surplus: 30,
      waste: 10,
      wasteType: "Organic",
      wasteReason: "Overproduction",
      handlingStream: "compost",
      kitchenNotes: "Temporary integration test record",
    }),
  });
  assert.equal(createResponse.status, 201);
  const created = (await createResponse.json()).data.record;
  createdRecordId = created.recordId;
  assert.equal(created.status, "Available");
  assert.equal(Object.hasOwn(created, "owner"), false);

  const listResponse = await request("/food-records", { token: providerToken });
  assert.equal(listResponse.status, 200);
  const listed = (await listResponse.json()).data.records;
  assert.ok(listed.some((record) => record.recordId === createdRecordId));

  const otherOwnerResponse = await request(`/food-records/${createdRecordId}`, { token: otherProviderToken });
  assert.equal(otherOwnerResponse.status, 404);

  const retrieveResponse = await request(`/food-records/${createdRecordId}`, { token: providerToken });
  assert.equal(retrieveResponse.status, 200);

  const updateResponse = await request(`/food-records/${createdRecordId}`, {
    token: providerToken,
    method: "PUT",
    body: JSON.stringify({
      date: "2026-10-12",
      mealType: "Lunch",
      foodCategory: "Rice",
      itemName: `Updated integration record ${testSuffix}`,
      foodPrepared: 120,
      foodConsumed: 60,
      surplus: 30,
      waste: 10,
    }),
  });
  assert.equal(updateResponse.status, 200);
  assert.equal((await updateResponse.json()).data.record.foodPrepared, 120);

  const invalidUpdateResponse = await request(`/food-records/${createdRecordId}`, {
    token: providerToken,
    method: "PUT",
    body: JSON.stringify({ foodPrepared: 10 }),
  });
  assert.equal(invalidUpdateResponse.status, 400);

  const deleteResponse = await request(`/food-records/${createdRecordId}`, {
    token: providerToken,
    method: "DELETE",
  });
  assert.equal(deleteResponse.status, 200);

  const deletedResponse = await request(`/food-records/${createdRecordId}`, { token: providerToken });
  assert.equal(deletedResponse.status, 404);
  createdRecordId = null;
});