import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      required: true,
      enum: ["FOOD_PROVIDER", "NGO", "ADMIN"],
      default: "FOOD_PROVIDER",
    },
    phone: { type: String, trim: true },
    organizationName: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set("toJSON", {
  transform(document, result) {
    delete result.password;
    return result;
  },
});

const User = mongoose.model("User", userSchema);

export default User;