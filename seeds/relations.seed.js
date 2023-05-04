const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../models/Book.js");
const { Author } = require("../models/Author.js");
const { generateRandom } = require("../utils.js");

const relationSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión!");

    // Recuperamos libros y autores
    const books = await Book.find();
    const authors = await Author.find();

    // Comprobar que existen libros
    if (!books.length) {
      console.error("No hay libros para relacionar en la base de datos");
      return;
    }

    // Comprobar que existen autores
    if (!authors.length) {
      console.error("No hay autores para relacionar en la base de datos");
      return;
    }

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const randomAuthor = authors[generateRandom(0, authors.length - 1)];
      book.author = randomAuthor.id;
      await book.save();
    }

    console.log("Relación entre libros-autores creada correctamente.");
  } catch (error) {
  } finally {
    mongoose.disconnect();
  }
};

relationSeed();
