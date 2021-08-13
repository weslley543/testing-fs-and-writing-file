import { UserRepository } from '../repository/UserRepository';
import { UserService } from '../services/UserService';
import { EncrypterHelper } from '../helpers/EncrypterHelper';
import { EmailValidatorHelper } from '../helpers/EmailValidatorHelper';

export default (): UserService => {
    const encrypterHelper = new EncrypterHelper(8);
    const userRepository = new UserRepository(encrypterHelper);
    const emailValidator = new EmailValidatorHelper();
    return new UserService(emailValidator, userRepository);
};
