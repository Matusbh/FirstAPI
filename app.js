import "dotenv/config";
import express from "express";
import morgan from "morgan";

const app = express();
//Si existe el valor port en el .env se usa ese si no se usa el 3000
const port = process.env.PORT || 3000;

app.use(morgan("dev"));

//midelware para parsear el body de las peticiones a json se debe usar antes de las rutas
app.use(express.json());

//Aplicacion de express
//Prticion get sincreona cuando se dispara el evento de la ruta '/'
app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

export default app;
