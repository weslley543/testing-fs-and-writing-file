import { EmailValidatorHelper as EmailValidator } from '../protocols/EmailValidatorHelper'
import validator from 'validator'
export class EmailValidatorHelper implements EmailValidator {
    isValid(email: string): boolean {
        return validator.isEmail(email)
    }
}
