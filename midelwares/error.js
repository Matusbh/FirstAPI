import logger from "../helpers/logger.js";

//Mandamos mensaje al usuario del error que queremos pero nosotros internamente tenemos acceso a ese ficheroi donde esta el error
export default function error(err, req, res, next) {
  (logger.error(err.message, { metadata: err }),
    res.status(500).send("Something failed"));
}
