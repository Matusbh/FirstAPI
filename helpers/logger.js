import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
  transports: [
    //Este guarda todos los mensajes de tipo error
    new winston.transports.File({ filename: "error.log", level: "error" }),
    //Este guarda todos los mensajes de tipo informacion
    new winston.transports.File({ filename: "info.log", level: "info" }),
  ],
});

export default logger;
