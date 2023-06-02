import { travelRouter } from "./routes/travel.routes";
import { trainRouter } from "./routes/train.routes";
import { userRouter } from "./routes/user.routes";
import { reservationRouter } from "./routes/reservation.routes";
import { AppDataSource } from "./databases/typeorm-datasource";
import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";
import express from "express";
import cors from "cors";

const main = async (): Promise<void> => {
  // Conexión a la BBDD
  const datasource = await AppDataSource.initialize();

  // Configuración del app
  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors({ origin: "http://localhost:3000" }));

  //  Middlewares de aplicación
  app.use((req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date.toString()}`);
    next();
  });
  // Rutas
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    res.send(`
      <h3>Esta es la home de nuestra API.</h3>
      <p>Estamos usando TypeORM con la BBDD: ${datasource.options.database as string}</p>
    `);
  });
  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Usamos las rutas
  app.use("/reservation", reservationRouter);
  app.use("/user", userRouter);
  app.use("/travel", travelRouter);
  app.use("/train", trainRouter);
  app.use("/", router);

  // Middleware de gestión de errores
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** INICIO DE ERROR ***");
    console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN DE ERROR ***");

    // Truco para quitar el tipo a una variable
    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg && errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else if (errorAsAny?.code === "ER_NO_DEFAULT_FOR_FIELD") {
      res.status(400).json({ error: errorAsAny?.sqlMessage });
    } else {
      res.status(500).json(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`app levantado en el puerto ${PORT}`);
  });
};
void main();
