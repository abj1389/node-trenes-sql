const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del libro
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    pages: {
      type: Number,
      required: false,
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = { Book };
