import { UserService } from '../../src/services/UserService';
import { EmailValidatorHelper } from '../../src/protocols/EmailValidatorHelper'
import { UserRepository } from '../../src/protocols/UserRepository'
import { CreateUser } from '../../src/types/CreateUser';
import { User } from '../../src/models/User'
import { SignInUser } from '../../src/types/SignInUser';
import { LoggedUser } from '../../src/types/LoggedUser';

interface SutTypes {
    sut: UserService;
    emailValidator: EmailValidatorHelper;
    userRepository: UserRepository;
}

const makeUserRepositoryStub = (): UserRepository => {
    class UserRepositoryStub implements UserRepository {
        async registerUser(userData: CreateUser): Promise<User>{
            const fakeAccount = {
                name: 'weslley de campos',
                password_hash: 'any_password',
                email: 'any_email',
                id: 'any_id'
            }
            return new Promise(resolve => resolve(fakeAccount));
        }
        async singIn(singIn: SignInUser): Promise<LoggedUser>{
            const loggedUser = {
                email: 'any_email',
                id: 'any_id',
                name: 'weslley de campos'
            }
            return new Promise(resolve => resolve(loggedUser));
        }
        async findUserByEmail(email: string): Promise<User> {
            return null;
        }
    }
    return new UserRepositoryStub();
}

const makeEmailValidator = (): EmailValidatorHelper => {
    class EmailValidatorStub implements EmailValidatorHelper {
         isValid(email: string): boolean{
            return true
        }
    }
    return new EmailValidatorStub();
}

const makeSut = (): SutTypes => {
    const userRepository = makeUserRepositoryStub();
    const emailValidator = makeEmailValidator();
    const sut = new UserService(emailValidator, userRepository);

    return { sut, emailValidator, userRepository }
}

describe('UserService', () => {
    test('should UserService return status 400 when email is no provided ', async () => {
        const { sut } = makeSut();
        const body = {
            name: 'weslley de campos',
            password:'any_password',
            password_confirmation:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error(`email is required`))

    });
    test('should UserService return status 400 email is no provided ', async () => {
        const { sut } = makeSut();
        const body = {
            email: 'any_email@mail.com',
            password:'any_password',
            password_confirmation:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error(`name is required`))

    });
    test('should UserService return status 400 password is no provided ', async () => {
        const { sut } = makeSut();
        const body = {
            email: 'any_email@mail.com',
            name: 'weslley de campos',
            password_confirmation:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error(`password is required`))
    });
    test('should UserService return status 400 password_confirmation is no provided ', async () => {
        const { sut } = makeSut();
        const body = {
            email: 'any_email@mail.com',
            name: 'weslley de campos',
            password:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error(`password_confirmation is required`))

    });
    test('should UserService return status 400 password_confirmation is no provided ', async () => {
        const { sut } = makeSut();
        const body = {
            email: 'any_email@mail.com',
            name: 'weslley de campos',
            password:'any_password',
            password_confirmation:'any_password2'
        }

        const httpResponse = await sut.registerUser({body});
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error('passwords must be equals'))
    });

    test('should return status 400 when email is not valid', async () => {
        const { sut, emailValidator } = makeSut();
        jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
        
        const body = {
            email: 'any_email',
            name: 'weslley de campos',
            password:'any_password',
            password_confirmation:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error('email is not valid'))
    });
    test('should return status 500 when email validator throws', async () => {
        const { sut, emailValidator } = makeSut();
        jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(()=>{
            throw new Error()
        })
        
        const body = {
            email: 'any_email',
            name: 'weslley de campos',
            password:'any_password',
            password_confirmation:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new Error('internal server error'))
    });

    test('should return status 400 when user already registered', async () => {
        const { sut, userRepository } = makeSut();
        jest.spyOn(userRepository, 'findUserByEmail').mockReturnValueOnce(new Promise(resolve => resolve({ 
            name: 'any_name',
            password_hash: 'any_password',
            email: 'any_email',
            id: 'any_id'
        })));
        
        const body = {
            email: 'any_email@email',
            name: 'weslley de campos',
            password:'any_password',
            password_confirmation:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error('user already exists'));
    });

    test('should register userRepository is called with correct params', async () => {
        const { sut, userRepository } = makeSut();
        const addSpy = jest.spyOn(userRepository, 'registerUser')
        
        const body = {
            email: 'any_email',
            name: 'weslley de campos',
            password:'any_password',
            password_confirmation:'any_password'
        }

        await sut.registerUser({body});
        
        expect(addSpy).toHaveBeenCalledWith({
            email: 'any_email',
            name: 'weslley de campos',
            password:'any_password',
        })
    });

    test('should return 500 when userRepository throws', async () => {
        const { sut, userRepository } = makeSut();
        jest.spyOn(userRepository, 'registerUser').mockImplementationOnce(() => {
            throw new Error()
        });
        
        const body = {
            email: 'any_email',
            name: 'weslley de campos',
            password:'any_password',
            password_confirmation:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new Error('internal server error'))
    });

    test('should return 200 when account is created', async () => {
        const { sut } = makeSut();
        const body = {
            email: 'any_email',
            name: 'weslley de campos',
            password:'any_password',
            password_confirmation:'any_password'
        }

        const httpResponse = await sut.registerUser({body});
        
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            name: 'weslley de campos',
            password_hash: 'any_password',
            email: 'any_email',
            id: 'any_id'
        })
    });

    test('should return 400 when password is not provided', async () => {
        const { sut } = makeSut();
        const body = {
            password:'any_password',
        }

        const httpResponse = await sut.singIn({body});
        
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error(`email is required`))
    });

    test('should return 400 when email is not provided', async () => {
        const { sut } = makeSut();
        const body = {
            email:'any_email',
        }

        const httpResponse = await sut.singIn({body});
        
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error(`password is required`))
    });

    test('should return 400 when email is not valid', async () => {
        const { sut, emailValidator } = makeSut();
        const body = {
            email:'any_email',
        }
        jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.singIn({body});
        
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error(`password is required`))
    });

    test('should return 500 when email validator throws', async () => {
        const { sut, emailValidator } = makeSut();
        const body = {
            email:'any_email',
            password: 'any_password'
        }
        jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        });
        const httpResponse = await sut.singIn({body});
        
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new Error('internal server error'))
    });


    test('should register userRepository is called with correct params', async () => {
        const { sut, userRepository } = makeSut();
        const addSpy = jest.spyOn(userRepository, 'singIn')
        
        const body = {
            email: 'any_email',
            password:'any_password',
        }

        await sut.singIn({body});
        
        expect(addSpy).toHaveBeenCalledWith({
            email: 'any_email',
            password:'any_password',
        })
    });

    test('should return 500 when userRepository throws', async () => {
        const { sut, userRepository } = makeSut();
        jest.spyOn(userRepository, 'singIn').mockImplementationOnce(() => {
            throw new Error()
        });
        
        const body = {
            email: 'any_email',
            password:'any_password',
        }

        const httpResponse = await sut.singIn({body});
        
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new Error('internal server error'))
    });

    test('should return 400 when account is not finded', async () => {
        const { sut, userRepository } = makeSut();
        jest.spyOn(userRepository, 'singIn').mockImplementationOnce(() => {
            return null;
        });
        
        const body = {
            email: 'any_email',
            password:'any_password',
        }

        const httpResponse = await sut.singIn({body});
        
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error('user is not find'));
    })

    test('should return account is finded', async () => {
        const { sut } = makeSut();
        const body = {
            email: 'any_email',
            password:'any_password',
        }

        const httpResponse = await sut.singIn({body});
        
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            name: 'weslley de campos',
            email: 'any_email',
            id: 'any_id'
        })
    });
    
});
