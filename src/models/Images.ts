import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Account from "./Account";

@Entity('images')
export default class Image {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Account, account => account.images)
  @JoinColumn({name: 'account_id'})
  account: Account;

}
