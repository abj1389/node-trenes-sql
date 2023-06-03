import "reflect-metadata";
import { DataSource } from "typeorm";
import { Travel } from "../models/typeorm/Travel";
import { Train } from "../models/typeorm/Train";
import dotenv from "dotenv";
import { Reservation } from "../models/typeorm/Reservation";
import { User } from "../models/typeorm/User";
dotenv.config();

const SQL_HOST: string = process.env.SQL_HOST as string;
const SQL_USER: string = process.env.SQL_USER as string;
const SQL_PASSWORD: string = process.env.SQL_PASSWORD as string;
const SQL_DATABASE: string = process.env.SQL_DATABASE as string;

export const AppDataSource = new DataSource({
  host: SQL_HOST,
  username: SQL_USER,
  password: SQL_PASSWORD,
  database: SQL_DATABASE,
  type: "mysql",
  port: 3306,
  synchronize: true,
  logging: false,
  entities: [Travel, Train, User, Reservation], // TODO
  migrations: [], // TODO
  subscribers: [], // TODO
});
