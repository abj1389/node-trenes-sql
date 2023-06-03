import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { User } from "../models/typeorm/User";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";
import { Reservation } from "../models/typeorm/Reservation";
import { generateToken } from "../utils/token";
import bcrypt from "bcrypt";

const userRepository: Repository<User> = AppDataSource.getRepository(User);
const reservationRepository: Repository<Reservation> = AppDataSource.getRepository(Reservation);

// Router
export const userRouter = Router();

// CRUD: READ
userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: User[] = await userRepository.find({ relations: ["reservations"] });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const user = await userRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["reservations"],
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/firstName/:firstName", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const firstNameReceivedInParams = req.params.firstName;

    const user = await userRepository.find({
      where: {
        firstName: firstNameReceivedInParams,
      },
      relations: ["reservations"],
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
userRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Construimos user
    const newUser = new User();

    let userReservation;

    if (req.body.reservationId) {
      userReservation = await reservationRepository.findOne({
        where: {
          id: req.body.reservationId,
        },
      });

      if (!userReservation) {
        res.status(404).json({ error: "Reservation not found" });
        return;
      }
    }

    // Asignamos valores
    Object.assign(newUser, {
      ...req.body,
      reservation: userReservation,
    });

    const userSaved = await userRepository.save(newUser);

    res.status(201).json(userSaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
userRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const userToRemove = await userRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!userToRemove) {
      res.status(404).json({ error: "User not found" });
    } else {
      await userRepository.remove(userToRemove);
      res.json(userToRemove);
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const userToUpdate = await userRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!userToUpdate) {
      res.status(404).json({ error: "User not found" });
    } else {
      let userReservation;

      if (req.body.reservationId) {
        userReservation = await reservationRepository.findOne({
          where: {
            id: req.body.reservationId,
          },
        });

        if (!userReservation) {
          res.status(404).json({ error: "Reservation not found" });
          return;
        }
      }

      // Asignamos valores
      Object.assign(userToUpdate, {
        ...req.body,
        reservations: userReservation,
      });

      const updatedUser = await userRepository.save(userToUpdate);
      res.json(updatedUser);
    }
  } catch (error) {
    next(error);
  }
});

// Login de usuarios
userRouter.post("/login", async (req: any, res: Response, next: NextFunction) => {
  try {
    // Declaracion de dos const con el mismo nombre que los campos que queremos del body
    const { email, password } = req.body;

    // Comprueba si hay usuario y contraseña
    if (!email || !password) {
      res.status(400).send("Falta el usuario o la contraseña.");
      return;
    }

    // Busca el usuario, seleccionando tambien el campo password
    const userFound = await userRepository.findOne({
      where: {
        email: req.body.userEmail,
      },
    });

    if (!userFound) {
      return res.status(401).json({ error: "Combinacion de usuario y password incorrecta" });
    }

    // Compara el password recibido con el guardado previamente encriptado
    const passwordMatches = await bcrypt.compare(password, userFound.password);
    if (passwordMatches) {
      // Eliminamos el password del objeto que devuelve
      const authorPasswordFiltered = userFound as any;
      delete authorPasswordFiltered.password;

      // Generamos token JWT
      const jwtToken = generateToken(userFound.id.toString(), userFound.email);

      console.log("Login correcto");

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Combinacion de usuario y password incorrecta" });
    }
  } catch (err) {
    next(err);
  }
});
