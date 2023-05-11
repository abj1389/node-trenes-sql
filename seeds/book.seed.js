const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../models/Book.js");
const { faker } = require("@faker-js/faker");

const bookList = [];

// Creamos libros adicionales
for (let i = 0; i < 50; i++) {
  const newBook = {
    title: "The " + faker.word.adjective() + " " + faker.word.noun(),
    pages: faker.datatype.number({ max: 3031, min: 1 }),
    publisher: {
      name: faker.company.name(),
      country: faker.address.country(),
    },
  };
  bookList.push(newBook);
}

const bookSeed = async () => {
  try {
    // Conectar a BBDD
    await connect();
    console.log("Tenemos conexión");
    // Borrar datos
    await Book.collection.drop();
    console.log("Libros eliminados");
    // Añadir libros
    const documents = bookList.map((book) => new Book(book));
    await Book.insertMany(documents);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};
bookSeed();
