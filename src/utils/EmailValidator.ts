import {validate} from 'email-validator'

export default function EmailValidator(email: string){
  return validate(email)
}
