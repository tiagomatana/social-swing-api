import {Column, Entity, Index, ObjectID, ObjectIdColumn} from "typeorm";
import Point from "@models/Point";

@Entity('locations')
export default class Image {
  @ObjectIdColumn()
  id: ObjectID;

  @Column(type => Point)
  point: Point;

  @Column()
  city: string

  @Index('account_email', { unique: true})
  @Column()
  account_email: string;

  @Column()
  last_updated: Date = new Date();

}
