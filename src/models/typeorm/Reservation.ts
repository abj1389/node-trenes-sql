// PAID, USER, TRIP.
/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

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

  @Column()
  trip: string;

  // USERS
  @OneToMany((type) => User, (user) => user.reservation, { cascade: true })
  users: User[];
}
