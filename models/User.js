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
userSchema.pre("save", async function () {
  //Comprobamos que la contraseña ha sido modificada, si no ha sido modificada no hacemos nada y salimos de la función
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//Indexamos este id porque por defecto mongoose indexa el id que genera por defecto, pero nosotros generamos un id con uuidv4 y queremos indexar ese id para que sea más rápido buscarlo en la base de datos.
userSchema.index({ id: 1, email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
