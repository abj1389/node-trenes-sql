/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Train } from "./Train";
import { Reservation } from "./Reservation";

@Entity()
export class Travel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column("datetime")
  initDate: Date;

  @Column("datetime")
  endDate: Date;

  @Column()
  price: number;

  @ManyToOne((type) => Train, (train) => train.travels)
  train: Train;

  @ManyToOne((type) => Reservation, (reservation) => reservation.travel)
  reservation: Reservation;
}
