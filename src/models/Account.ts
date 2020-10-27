import {Column, Entity, Index, ObjectID, ObjectIdColumn} from "typeorm";
import Image from "./Images";
import Point from "@models/Point";

@Entity('accounts')
export default class Account {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Index('email', { unique: true})
  @Column()
  email: string;

  @Column({type: "date"})
  birthdate: Date;

  @Column()
  password: string;

  @Column()
  genre: string;

  @Column()
  last_login: Date = new Date();

  @Column({default: false})
  active: boolean = false;

  @Column({default: false})
  is_administrator: boolean = false;

  @Column({default: false})
  is_blocked: boolean = false;

  @Column({nullable: true})
  sex_orientation: string;

  @Column({nullable: true})
  relationship: string;

  @Column({nullable: true})
  about: string

  @Column({nullable: true})
  photo: string;

  @Column(type => Image)
  images: Image[];

  @Column(type => Point)
  location: Geolocation


  @Column()
  created: Date = new Date()

}
