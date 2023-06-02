import { type Router, type NextFunction, type Request, type Response } from "express";
import { type Repository } from "typeorm";
import { AppDataSource } from "../databases/typeorm-datasource";
import { Reservation } from "../models/typeorm/Reservation";
import { User } from "../models/typeorm/User";

const reservationRepository: Repository<Reservation> = AppDataSource.getRepository(Reservation);
const userRepository: Repository<User> = AppDataSource.getRepository(User);

// Router
export const reservationRouter = Router();

// CRUD: READ
reservationRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations: Reservation[] = await reservationRepository.find({ relations: ["users"] });
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

reservationRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const reservation = await reservationRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["users"],
    });

    if (!reservation) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

reservationRouter.get("/user/:userId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdReceivedInParams = parseInt(req.params.userId);

    const reservations = await reservationRepository.findOne({
      where: {
        id: userIdReceivedInParams,
      },
      relations: ["users"],
    });

    if (reservations.length === 0) {
      res.status(404).json({ error: "Reservations not found" });
      return;
    }

    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
reservationRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, ...reservationData } = req.body;

    let userOfReservation: User | undefined;

    if (userId) {
      userOfReservation = await userRepository.findOne(userId);

      if (!userOfReservation) {
        res.status(404).json({ error: "User not found" });
        return;
      }
    }

    const newReservation = reservationRepository.create({
      ...reservationData,
      users: userOfReservation ? [userOfReservation] : undefined,
    });

    const reservationSaved = await reservationRepository.save(newReservation);

    res.status(201).json(reservationSaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
reservationRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const reservationToRemove = await reservationRepository.findOne(idReceivedInParams);

    if (!reservationToRemove) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }

    await reservationRepository.remove(reservationToRemove);

    res.json(reservationToRemove);
  } catch (error) {
    next(error);
  }
});

reservationRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const reservationToUpdate = await reservationRepository.findOne(idReceivedInParams);

    if (!reservationToUpdate) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }

    const { userId, ...reservationData } = req.body;

    let userOfReservation: User | undefined;

    if (userId) {
      userOfReservation = await userRepository.findOne(userId);

      if (!userOfReservation) {
        res.status(404).json({ error: "User not found" });
        return;
      }
    }

    Object.assign(reservationToUpdate, reservationData);
    reservationToUpdate.users = userOfReservation ? [userOfReservation] : undefined;

    const updatedReservation = await reservationRepository.save(reservationToUpdate);

    res.json(updatedReservation);
  } catch (error) {
    next(error);
  }
});
