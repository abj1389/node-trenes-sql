import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { Travel } from "../models/typeorm/Travel";
import { Train } from "../models/typeorm/Train";
import { Reservation } from "../models/typeorm/Reservation";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";

const travelRepository: Repository<Travel> = AppDataSource.getRepository(Travel);
const trainRepository: Repository<Train> = AppDataSource.getRepository(Train);
const reservationRepository: Repository<Reservation> = AppDataSource.getRepository(Reservation);

// Router
export const travelRouter = Router();

// CRUD: READ
travelRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const travels: Travel[] = await travelRepository.find({ relations: ["train", "reservations"] });
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
      relations: ["train", "reservations"],
    });

    if (!travel) {
      res.status(404).json({ error: "Travel not found" });
    }

    res.json(travel);
  } catch (error) {
    next(error);
  }
});

// Dejo comentado esto por si se retoca en un futuro para algúna busqueda concreta...
// travelRouter.get("/firstName/:firstName", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const firstNameReceivedInParams = req.params.firstName;

//     const travel = await travelRepository.find({
//       where: {
//         firstName: firstNameReceivedInParams,
//       },
//       relations: ["train"],
//     });

//     if (!travel) {
//       res.status(404).json({ error: "Travel not found" });
//     }

//     res.json(travel);
//   } catch (error) {
//     next(error);
//   }
// });

// CRUD: CREATE
travelRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Construimos travel
    const newTravel = new Travel();

    let trainOfTravel;
    const reservationOfTravel = [];

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
    }

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
    }

    // Asignamos valores
    Object.assign(newTravel, {
      ...req.body,
      train: trainOfTravel,
      reservations: reservationOfTravel,
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
    } else if (travelToRemove.train) {
      await trainRepository.findOne({
        where: {
          id: travelToRemove.train.id,
        },
      });
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
