import { AppDataSource } from "../databases/typeorm-datasource";
import { Reservation } from "../models/typeorm/Reservation";

export const reservationSeed = async (): Promise<void> => {
  // Nos conectamos a la BBDD
  const dataSource = await AppDataSource.initialize();
  console.log(`Connected successfully to ${dataSource?.options?.database as string}`);

  // Eliminamos los datos existentes
  await AppDataSource.manager.delete(Reservation, {});
  console.log("Existing reservations deleted");

  // Creamos dos reservations
  const reservation1 = {
    paymentStatus: "unpaid",
    trip: "Madrid",
    user: "Jorge",
  };

  const reservation2 = {
    paymentStatus: "unpaid",
    trip: "Valencia",
    user: "Ana",
  };

  // Creamos las entidades
  const reservation1Entity = AppDataSource.manager.create(Reservation, reservation1);
  const reservation2Entity = AppDataSource.manager.create(Reservation, reservation2);

  // Las guardamos en base de datos
  await AppDataSource.manager.save(reservation1Entity);
  await AppDataSource.manager.save(reservation2Entity);

  console.log("Reservations created");

  // Cerramos la conexión
  await AppDataSource.destroy();
  console.log("SQL connection closed");
};

void reservationSeed();
