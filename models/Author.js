const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedCountries = ["COLOMBIA", "ENGLAND", "RUSSIA", "UNITED STATES", "ARGENTINA", "CZECHOSLOVAKIA", "JAPAN", "NIGERIA"];

// Creamos el schema del autor
const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "El nombre debe tener 3 caracteres como minimo..."],
      maxLength: [30, "El nombre no puede tener mas de 20 caracteres..."],
    },
    country: {
      type: String,
      required: true,
      trim: true,
      enum: allowedCountries,
      uppercase: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema);
module.exports = { Author };
