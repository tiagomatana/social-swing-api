export default interface AccountInterface {

  id: number;
  name: string;
  surname: string;
  email: string;
  birthdate: Date;
  password: string;
  genre: string;
  last_login?: Date;
  active?: boolean;
  is_administrator?: boolean;
  is_blocked?: boolean;
  sex_orientation?: string;
  relationship?: string;
  about?: string
  photo?: string;

}
