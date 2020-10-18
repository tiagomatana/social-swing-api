import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

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

  @Column()
  birthdate: Date;

  @Column()
  password: string;

  @Column()
  genre: string;

  @Column({default: new Date()})
  last_login: Date;

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

}
