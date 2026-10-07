import express from "express";
import Ticket from "../models/Ticket.js";
import auth from "../midelwares/auth.js";
import admin from "../midelwares/admin.js";
import buildFilter from "../midelwares/filter.js";
import pagination from "../midelwares/pagination.js";

const router = express.Router();

//GET all tickets
//GET /api/tickets
//GET /api/tickets?pageSize=10&page=1
//GET /api/tickets?status=open&priority=high
//GET /api/tickets?search=bug
//public
router.get("/", buildFilter, pagination(Ticket), async (req, res) => {
  res.status(200).json(req.paginatedResults);
});

//Crea tickets
// POST api create ticket
//Private Only loged users can create tickets
//Ticket Schema: user, titile, desctription, priority, status
router.post("/", auth, async (req, res) => {
  //Creamos un nuevo ticket con los datos que nos llegan del body
  const ticket = new Ticket({
    user: req.user._id,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
  });

  try {
    //Guardamos el ticket en la base de datos
    const newTicket = await ticket.save();
    //Respondemos con el ticket que se ha creado
    res.status(201).send(newTicket);
  } catch (err) {
    res.status(500).send({ message: "Server Error: " + err.message });
  }
});

//Get ticket by id
//Get por id
//Public
router.get("/:id", async (req, res) => {
  try {
    // const ticket = await Ticket.findById(req.params.id); esto  es si usamos el ide de mopngoose para buscar por id, pero nosotros generamos un id con uuidv4 y queremos buscar por ese id que generamos nosotros

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
//Private(only logged in users can update tickets)
//Tickets Schema: users, titile, description, priority,status
router.put("/:id", auth, async (req, res) => {
  const update = req.body;

  try {
    // Actualizamos el ticket con los datos del body
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!ticket) return res.status(400).send({ message: "Ticket not found" });

    res.status(200).send({ ticket: ticket });
  } catch (err) {
    res.status(500).send({ message: "Server Error" + err.message });
  }
});

//Delete ticket by id
//Private (only admin users can delete tickets)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ id: req.params.id });

    if (!ticket) return res.status(400).send({ message: "Ticket not found" });

    res.status(200).send({ ticket: ticket });
  } catch (err) {
    res.status(500).send({ message: "Server Error" + err.message });
  }
});

export default router;
