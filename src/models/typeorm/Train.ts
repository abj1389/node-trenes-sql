/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Travel } from "./Travel";

@Entity()
export class Train {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  license: string;

  @Column()
  type: string;

  @Column()
  capacity: number;

  // ESTUDIANTES
  @OneToMany((type) => Travel, (travel) => travel.train, { cascade: true })
  travels: Travel[];
}
