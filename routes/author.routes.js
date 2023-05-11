const express = require("express");
const { Book } = require("../models/Book");

// Modelos
const { Author } = require("../models/Author.js");

// Router propio de libros
const router = express.Router();

// CRUD: READ
router.get("/", async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const authors = await Author.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Número total de elementos
    const totalElements = await Author.countDocuments();
    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: authors,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const author = await Author.findById(id);

    if (author) {
      const temporalAuthor = author.toObject();
      const includeBooks = req.query.includeBooks === "true";
      if (includeBooks) {
        const books = await Book.find({ author: id });
        temporalAuthor.books = books;
      }

      res.json(temporalAuthor);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const author = await Author.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (author?.length) {
      res.json(author);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: CREATE
router.post("/", async (req, res) => {
  try {
    const author = new Author(req.body);

    const createdAuthor = await author.save();
    return res.status(201).json(createdAuthor);
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

// CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const authorDeleted = await Author.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: UPDATE
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const authorUpdated = await Author.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (authorUpdated) {
      res.json(authorUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

module.exports = { authorRouter: router };
