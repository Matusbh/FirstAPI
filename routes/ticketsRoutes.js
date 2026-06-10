import mongoose from "mongoose";
import express from "express";
import Ticket from "../models/Ticket.js";

const router = express.Router();

//GET que nos trae todo porque esta sin parametros especificados de que traer
router.get("/", async (req, res) => {
  try {
    const ticket = await Ticket.find({});
    res.status(200).send(ticket);
  } catch (err) {
    res.status(500).send({ message: "Server Error" + err.message });
  }
});

// POST api create ticket
router.post("/", async (req, res) => {
  const ticket = new Ticket({
    user: req.body.user,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
  });

  try {
    const newTicket = await ticket.save();
    res.status(201).send(newTicket);
  } catch (err) {
    res.status(500).send({ message: "Server Error: " + err.message });
  }
});

//Get por id
router.get("/:id", async (req, res) => {
  try {
    // const ticket = await Ticket.findById(req.params.id); esto  es si usamos el ide de mopngoose

    const ticket = await Ticket.findOne({ id: req.params.id }); //esto es si usamos el id que generamos con uuidv4
    //Si no existe el ticket que solicitamos
    if (!ticket) {
      return res.status(400).send({ message: "Ticket not found" });
    }
    res.status(200).send({ ticket: ticket });
  } catch (err) {
    res.status(500).send({ message: "Server Error" + err.message });
  }
});

//Put para actualizar
router.put("/:id", async (req, res) => {
  const update = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!ticket) return res.status(400).send({ message: "Ticket not found" });

    res.status(200).send({ ticket: ticket });
  } catch (err) {
    res.status(500).send({ message: "Server Error" + err.message });
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) return res.status(400).send({ message: "Ticket not found" });

    res.status(200).send({ ticket: ticket });
  } catch (err) {
    res.status(500).send({ message: "Server Error" + err.message });
  }
});

export default router;
