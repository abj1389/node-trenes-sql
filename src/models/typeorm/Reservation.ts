/* eslint-disable @typescript-eslint/indent */
// PAID, USER, TRIP.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
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

  @ManyToOne((type) => Travel, (travel) => travel.reservation)
  travel: Travel;

  // USERS
  @OneToMany((type) => User, (user) => user.reservation, { cascade: true })
  users: User[];
}
