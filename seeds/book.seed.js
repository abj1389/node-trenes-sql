const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../models/Book.js");
const { faker } = require("@faker-js/faker");

const bookList = [];

// Creamos libros adicionales
for (let i = 0; i < 50; i++) {
  const newBook = {
    title: "The " + faker.word.adjective() + " " + faker.word.noun(),
    author: faker.name.fullName(),
    pages: faker.datatype.number({ max: 3031 }),
  };
  bookList.push(newBook);
}

connect().then(() => {
  console.log("Tenemos conexión");

  // Borrar datos
  Book.collection.drop().then(() => {
    console.log("Usuarios eliminados");

    // Añadimos libros
    const documents = bookList.map((book) => new Book(book));
    Book.insertMany(documents)
      .then(() => console.log("Datos guardados correctamente!"))
      .catch((error) => console.error(error))
      .finally(() => mongoose.disconnect());
  });
});
