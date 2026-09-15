import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  //Obtenemos el token del header de la petición
  const token = req.header("Authorization").replace("Bearer ", "");
  //Si no hay token, devolvemos un error 401 (no autorizado)
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    //Verificamos el token con la clave secreta que tenemos en el archivo .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    //Si el token es válido, añadimos el usuario verificado a la petición para que pueda ser usado en los controladores
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}
