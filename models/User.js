import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, required: true, unique: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
      },
      virtuals: true,
    },
  },
);

//Presave hace que si la contraseña es 1234 no se guarde 1234 por seguridad
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await brypt.hash(this.password, salt);
});

userSchema.index({ id: 1, email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
