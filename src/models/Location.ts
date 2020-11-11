import {Column, Entity, Index, ObjectID, ObjectIdColumn} from "typeorm";
import Point from "./Point";

@Entity('locations')
export default class Location {
  @ObjectIdColumn()
  id: ObjectID;

  @Column(type => Point)
  point: Point;

  @Index('account_email', { unique: true})
  @Column()
  account_email: string;

  @Column()
  last_updated: Date = new Date();

}
