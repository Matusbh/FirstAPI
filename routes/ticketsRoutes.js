import express from "express";
import Ticket from "../models/Ticket.js";
import auth from "../midelwares/auth.js";
import admin from "../midelwares/admin.js";

const router = express.Router();

//GET que nos trae todo porque esta sin parametros especificados de que traer
router.get("/", async (req, res) => {
  //Creamos la cantidad de objetos que va a haber enun apagina
  const pageSize = parseInt(req.query.pagesize) || 10;
  // Creamos la pagina inicial por defectro es decir la 0
  const page = parseInt(req.query.page) || 1;
  const status = req.query.status || "";
  const priority = req.query.priority || "";

  let filter = {};

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }
  try {
    //Concatenamos varias funciones ya nonecesitamos find todos si no qque empezamos en la pagina que hicimos y lo limitamos con el limite de objetos que creamos
    const tickets = await Ticket.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Ticket.countDocuments();
    // Ahora a la hora de enviar y ano solo enviamos los trickets si no que enviamos las paginas.
    res.status(200).send({
      tickets,
      page,
      pages: Math.ceil(total / pageSize),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).send({ message: "Server Error" + err.message });
  }
});

// POST api create ticket
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

//Get por id
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

//Delete
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
