import { Router, type NextFunction, type Request, type Response } from "express";
import { type Repository } from "typeorm";
import { AppDataSource } from "../databases/typeorm-datasource";
import { Reservation } from "../models/typeorm/Reservation";
import { User } from "../models/typeorm/User";
import { Travel } from "../models/typeorm/Travel";

const reservationRepository: Repository<Reservation> = AppDataSource.getRepository(Reservation);
const userRepository: Repository<User> = AppDataSource.getRepository(User);
const travelRepository: Repository<Travel> = AppDataSource.getRepository(Travel);

// Router
export const reservationRouter = Router();

// CRUD: READ
reservationRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations: Reservation[] = await reservationRepository.find({ relations: ["user", "travel"] });
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
      relations: ["user", "travel"],
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

// CRUD: CREATE
reservationRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, travelId, ...reservationData } = req.body;

    let userOfReservation: User | null = null;

    if (userId) {
      userOfReservation = await userRepository.findOneBy({
        id: userId,
      });

      if (!userOfReservation) {
        res.status(404).json({ error: "User not found" });
        return;
      }
    } else {
      res.status(400).json({ error: "User is mandatory" });
      return;
    }

    let travelOfReservation: Travel | null = null;

    if (travelId) {
      travelOfReservation = await travelRepository.findOneBy({
        id: travelId,
      });

      if (!travelOfReservation) {
        res.status(404).json({ error: "Travel not found" });
        return;
      }
    } else {
      res.status(400).json({ error: "Travel is mandatory" });
      return;
    }

    const newReservation = reservationRepository.create({
      ...reservationData,
      user: userOfReservation,
      travel: travelOfReservation,
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

    const reservationToRemove = await reservationRepository.findOneBy({
      id: idReceivedInParams,
    });

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
