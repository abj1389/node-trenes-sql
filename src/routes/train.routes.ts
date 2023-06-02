import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { Train } from "../models/typeorm/Train";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";

const trainRepository: Repository<Train> = AppDataSource.getRepository(Train);

// Router
export const trainRouter = Router();

// CRUD: READ
trainRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trains: Train[] = await trainRepository.find({ relations: ["travels"] });
    res.json(trains);
  } catch (error) {
    next(error);
  }
});

trainRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const train = await trainRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["travels"],
    });

    if (!train) {
      res.status(404).json({ error: "Train not found" });
    }

    res.json(train);
  } catch (error) {
    next(error);
  }
});

trainRouter.get("/type/:type", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const typeReceivedInParams = req.params.type;

    const train = await trainRepository.find({
      where: {
        type: typeReceivedInParams,
      },
      relations: ["travels"],
    });

    if (!train) {
      res.status(404).json({ error: "Train not found" });
    }

    res.json(train);
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
trainRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Construimos student
    const newTrain = new Train();

    // Asignamos valores
    Object.assign(newTrain, {
      ...req.body,
    });

    const trainSaved = await trainRepository.save(newTrain);

    res.status(201).json(trainSaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
trainRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const trainToRemove = await trainRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["travels"],
    });

    if (!trainToRemove) {
      res.status(404).json({ error: "Train not found" });
    } else {
      // Quitar a los jugadores este equipo
      for (const travel of trainToRemove.travels) {
        travel.train = null as any;
        await AppDataSource.manager.save(travel);
      }

      await trainRepository.remove(trainToRemove);
      res.json(trainToRemove);
    }
  } catch (error) {
    next(error);
  }
});

trainRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const trainToUpdate = await trainRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["travels"],
    });

    if (!trainToUpdate) {
      res.status(404).json({ error: "Train not found" });
    } else {
      // Asignamos valores
      Object.assign(trainToUpdate, req.body);

      const updatedTrain = await trainRepository.save(trainToUpdate);
      res.json(updatedTrain);
    }
  } catch (error) {
    next(error);
  }
});
