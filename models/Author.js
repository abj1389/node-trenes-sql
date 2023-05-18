const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const allowedCountries = ["COLOMBIA", "ENGLAND", "RUSSIA", "UNITED STATES", "ARGENTINA", "CZECHOSLOVAKIA", "JAPAN", "NIGERIA"];

// Creamos el schema del autor
const authorSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email incorrecto",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
    },
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

// authorSchema.pre("insertMany", { document: true, query: false }, async function (next) {
//   try {
//     if (this.isModified("password")) {
//       const saltRounds = 10;
//       const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
//       this.password = passwordEncrypted;
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

authorSchema.pre("save", async function (next) {
  try {
    // Si la contraseña ya estaba encriptada, no la encriptamos de nuevo
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Author = mongoose.model("Author", authorSchema);
module.exports = { Author };
