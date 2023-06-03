/* eslint-disable @typescript-eslint/indent */
// PAID, USER, TRIP.
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Travel } from "./Travel";

export enum paymentStatus {
  PAID = "paid",
  PENDING = "pending",
  UNPAID = "unpaid",
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: paymentStatus,
    default: paymentStatus.UNPAID,
  })
  paid: paymentStatus;

  @ManyToOne((type) => Travel, (travel) => travel.reservations)
  travel: Travel;

  @ManyToOne((type) => User, (user) => user.reservations)
  user: User;
}
