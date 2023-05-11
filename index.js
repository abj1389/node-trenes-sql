const express = require("express");
const { bookRouter } = require("./routes/book.routes.js");
const { authorRouter } = require("./routes/author.routes.js");
const cors = require("cors");

const main = async () => {
  // Conexión a la BBDD
  const { connect } = require("./db.js");
  await connect();

  // Configuración del server
  const PORT = 3000;
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(cors({ origin: "http://localhost:3000" }));

  // Rutas
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send("Esta es la home de nuestra API");
  });
  router.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Usamos las rutas
  server.use("/book", bookRouter);
  server.use("/author", authorRouter);
  server.use("/", router);

  server.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};
main();
