export default function pagination(model) {
  //esto es un closure
  return async (req, res, next) => {
    //Nukmero de objetos de la pagina
    const pageSize = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.page) || 1;
    //Esto es para que se salte todos aquellos elementos que NO estan contenidos dentro de la pagina que queremos leer y segun el tamaño de pagina que tengamos.
    const skip = (page - 1) * pageSize;

    const results = {};

    try {
      results.total = await model.countDocuments(req.filter).exec();
      results.results = await model
        .find(req.filter)
        .skip(skip)
        .limit(pageSize)
        .exec();

      results.pages = Math.ceil(results.total / pageSize);
      results.currentPage = page;
      req.paginatedResults = results;
      next();
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
}
