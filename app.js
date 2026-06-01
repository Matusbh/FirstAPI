import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";

const app = express();
const DB_URL =
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27017/ticketing-db-test"
    : process.env.DB_URL || "mongodb://localhost:27017/ticketing-db";

mongoose
  .connect(DB_URL)
  .then(() => console.log(`Connected to DB ${DB_URL}`))
  .catch((err) => console.error(`Failed to connect to DB: ${err}`));

const port = process.env.PORT || 3000;

app.use(morgan("dev"));

//midelware para parsear el body de las peticiones a json se debe usar antes de las rutas
app.use(express.json());

//Prticion get sincreona cuando se dispara el evento de la ruta '/'
app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

export default app;
