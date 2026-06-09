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
    res.status(404).send({ message: "Server Error" + err.message });
  }
});

// POST api create ticket
router.post("/", async (req, res) => {
  const ticket = new Ticket({
    user: req.body.user,
    tittle: req.body.tittle,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
  });

  try {
    const newTicket = await ticket.save();
  } catch {
    res.status(400).json({ message: "Something gone wrong" + message });
  }
});

//Get por id
router.get("/:id", async (req, res) => {});

//Put para actualizar
router.put("/:id", async (req, res) => {});

//Delete
router.delete("/:id", async (req, res) => {});

export default router;
