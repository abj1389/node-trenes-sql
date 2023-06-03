/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Reservation } from "./Reservation";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  dni: string;

  @Column()
  nationality: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  treatment: string;

  @OneToMany((type) => Reservation, (reservation) => reservation.user, { cascade: true })
  reservations: Reservation[];
}
