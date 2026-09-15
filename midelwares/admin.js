//iddelaware de autrorizacion que comprueba si el rol del usuario es admin

//Si ponemos este middelware despoues del de autentificacion ya existe req.user  y puede comprobar si el rol el admin o no
export default function admin(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "Acces denied. Dont hacve permission for this action ",
    });

  next();
}
