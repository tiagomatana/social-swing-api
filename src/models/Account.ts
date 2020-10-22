import {Column, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Image from "./Images";

@Entity('accounts')
export default class Account {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Index('email_idx', { unique: true})
  @Column()
  email: string;

  @Column({type: "date"})
  birthdate: string;

  @Column()
  password: string;

  @Column()
  genre: string;

  @Column({type: "timestamp", default: 'CURRENT_TIMESTAMP'})
  last_login: string;

  @Column({default: false})
  active: boolean;

  @Column({default: false})
  is_administrator: boolean;

  @Column({default: false})
  is_blocked: boolean;

  @Column({nullable: true})
  sex_orientation: string;

  @Column({nullable: true})
  relationship: string;

  @Column({nullable: true})
  about: string

  @Column({nullable: true})
  photo: string;

  @OneToMany(() => Image, image => image.account, {
    cascade: ['insert', "update"]
  })
  @JoinColumn({name: "account_id"})
  images: Image[]
}
