import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity('images')
export default class Image {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  path: string;

  @Column()
  account_email: string;

  @Column()
  created: Date = new Date();

}
