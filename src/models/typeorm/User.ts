/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Reserve } from "./Reserve";

@Entity()
export class Student {
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

  @ManyToOne((type) => Reserve, (reserve) => reserve.user)
  reserve: Reserve;
}
