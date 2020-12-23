import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity('messages')
export default class Message {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({type: "date"})
  timestamp: Date = new Date();

  @Column()
  msg: string;
}
