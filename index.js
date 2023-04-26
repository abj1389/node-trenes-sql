const express = require("express");

// Conexión a la BBDD
const { connect } = require("./db.js");
connect();

// Modelos
const { Book } = require("./models/Book.js");

// Creamos router de expres
const PORT = 3000;
const server = express();
const router = express.Router();

// Configuración del server
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Rutas
router.get("/", (req, res) => {
  res.send("Esta es la home de nuestra API");
});

router.get("/book", (req, res) => {
  Book.find()
    .then((books) => res.json(books))
    .catch((error) => res.status(500).json(error));
});

router.get("/book/:id", (req, res) => {
  const id = req.params.id;

  Book.findById(id)
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({});
      }
    })
    .catch((error) => res.status(500).json(error));
});

router.get("/book/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    // Busqueda exacta
    // const book = await Book.find({ title: title });

    const book = await Book.find({ title: new RegExp("^" + title.toLowerCase(), "i") });
    if (book?.length) {
      res.json(book);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint de creación de usuarios
router.post("/book", async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      pages: req.body.pages,
    });

    const createdBook = await book.save();
    return res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.use("/", router);
server.listen(PORT, () => {
  console.log(`Server levantado en el puerto ${PORT}`);
});
