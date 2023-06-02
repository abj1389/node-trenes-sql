/* eslint-disable @typescript-eslint/indent */
// PAID, USER, TRIP.
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "./User";
import { Travel } from "./Travel";

enum paymentStatus {
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

  @OneToOne((type) => Travel, (travel) => travel.reservations)
  travel: Travel;

  // USERS
  @OneToOne((type) => User, (user) => user.reservation, { cascade: true })
  users: User[];
}
