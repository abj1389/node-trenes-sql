import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { Travel } from "../models/typeorm/Travel";
import { Train } from "../models/typeorm/Train";
import { Reservation } from "../models/typeorm/Reservation";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository, Between } from "typeorm";

const travelRepository: Repository<Travel> = AppDataSource.getRepository(Travel);
const trainRepository: Repository<Train> = AppDataSource.getRepository(Train);
const reservationRepository: Repository<Reservation> = AppDataSource.getRepository(Reservation);

// Router
export const travelRouter = Router();

// CRUD: READ
travelRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const travels: Travel[] = await travelRepository.find({ relations: ["train", "reservations", "reservations.user"] });
    res.json(travels);
  } catch (error) {
    next(error);
  }
});

travelRouter.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const origin = req.body.origin;
    const destination = req.body.destination;
    const dayBegin = new Date(req.body.date);
    dayBegin.setHours(0);
    dayBegin.setMinutes(0);
    dayBegin.setSeconds(0);
    dayBegin.setMilliseconds(0);
    const dayEnd = new Date(req.body.date);
    dayEnd.setHours(23);
    dayEnd.setMinutes(59);
    dayEnd.setSeconds(59);
    dayEnd.setMilliseconds(999);

    console.log(dayBegin);

    console.log(dayEnd);

    const travels = await travelRepository.find({
      where: {
        origin,
        destination,
        initDate: Between(dayBegin, dayEnd),
      },
    });

    if (!travels) {
      res.status(404).json({ error: "Travel not found" });
    }

    res.json(travels);
  } catch (error) {
    next(error);
  }
});

travelRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const travel = await travelRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["train", "reservations", "reservations.user"],
    });

    if (!travel) {
      res.status(404).json({ error: "Travel not found" });
    }

    res.json(travel);
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
travelRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Construimos travel
    const newTravel = new Travel();

    let trainOfTravel;

    if (req.body.trainId) {
      trainOfTravel = await trainRepository.findOne({
        where: {
          id: req.body.trainId,
        },
      });

      if (!trainOfTravel) {
        res.status(404).json({ error: "Train not found" });
        return;
      }
    } else {
      res.status(400).json({ error: "Train is mandatory" });
      return;
    }

    // Asignamos valores
    Object.assign(newTravel, {
      ...req.body,
      train: trainOfTravel,
      reservations: [],
    });

    const travelSaved = await travelRepository.save(newTravel);

    res.status(201).json(travelSaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
travelRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const travelToRemove = await travelRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!travelToRemove) {
      res.status(404).json({ error: "Travel not found" });
    } else {
      await travelRepository.remove(travelToRemove);
      res.json(travelToRemove);
    }
  } catch (error) {
    next(error);
  }
});

travelRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const travelToUpdate = await travelRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!travelToUpdate) {
      res.status(404).json({ error: "Travel not found" });
    } else {
      let trainOfTravel;
      const reservationOfTravel = [];
      if (req.body.reservationList) {
        for (let i = 0; i < req.body.reservationList.length; i++) {
          reservationOfTravel.push(
            await reservationRepository.findOne({
              where: {
                id: req.body.reservationList[i],
              },
            })
          );
        }
        if (!reservationOfTravel) {
          res.status(404).json({ error: "Reservation not found" });
          return;
        }
        // Asignamos valores
        Object.assign(travelToUpdate, {
          ...req.body,
          train: trainOfTravel,
          reservations: reservationOfTravel,
        });
      }

      const updatedTravel = await travelRepository.save(travelToUpdate);
      res.json(updatedTravel);
    }
  } catch (error) {
    next(error);
  }
});
