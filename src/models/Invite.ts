import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity('invites')
export default class Invite {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({type: "date"})
  timestamp: Date = new Date();

}
