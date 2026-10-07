export default function buildFilter(req, res, next) {
  const { status, priority, search } = req.query;

  let filter = {};

  if (priority) {
    filter.priority = priority;
  }

  if (status) {
    filter.status = status;
  }

  //traeme tickets donde (el título cumpla la condición A) O (la descripción cumpla la condición B)". Sin $or, si pusieras title y description como dos propiedades separadas del mismo objeto filtro, Mongo las trataría como un AND implícito (tendrían que cumplirse las dos a la vez)
  if (search) {
    filter.$or = [
      //Esto jace que se busque con el search que hemos declarado en el titulo y la descripcion. Y la segunda opcion hace que no distinga de mayusculas y minusculas.
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  req.filter = filter;
  next();
}
