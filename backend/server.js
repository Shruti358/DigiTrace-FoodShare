import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import foodRecordRoutes from "./routes/foodRecordRoutes.js";
import surplusRoutes from "./routes/surplusRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

const sanitizeMongoErrorMessage = (message) =>
  (typeof message === "string" ? message : "Unknown MongoDB connection error")
    .replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, "[redacted MongoDB URI]")
    .replace(/querySrv\s+ENOTFOUND\s+[^\s"'<>]+/gi, "querySrv ENOTFOUND [redacted MongoDB SRV hostname]")
    .replace(/\b(username|password|passwd|user|token|secret|api[_-]?key)\s*[:=]\s*[^,\s;]+/gi, "$1=[redacted]");

const logMongoConnectionError = (error) => {
  if (process.env.NODE_ENV === "production") {
    console.error("MongoDB connection failed.");
    return;
  }

  const details = {
    name: typeof error?.name === "string" ? error.name : "Error",
    message: sanitizeMongoErrorMessage(error?.message),
  };
  const code = error?.code ?? error?.cause?.code ?? error?.codeName;

  if (typeof code === "number" || (typeof code === "string" && /^[A-Za-z0-9_.-]{1,80}$/.test(code))) {
    details.code = code;
  }

  console.error("MongoDB connection failed:", details);
};

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/food-records", foodRecordRoutes);
app.use("/api/surplus-listings", surplusRoutes);
app.use((request, response, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    logMongoConnectionError(error);
  }

  app.listen(port, () => {
    console.log(`DigiTrace backend listening on port ${port}.`);
  });
};

startServer();