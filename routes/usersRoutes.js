import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST api signup
router.post("/signup", async (req, res) => {
  let user;
  user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Usuario existente");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  try {
    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.header("Authorization", token).send({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// POST api login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or password invalid");

    //Comparamos la contraseña que nos llega en el body de la petición con la contraseña que tenemos en la base de datos, que está hasheada
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword)
      return res.status(400).send("Email or password invalid");

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).header("Authorization", token).json({ token: token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

export default router;
