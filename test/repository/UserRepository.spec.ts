import { rejects } from 'assert/strict';
import { MongoHelper } from '../../src/helpers/MongoHelper';
import { EncrypterHelper } from '../../src/protocols/EncrypterHelper';
import { UserRepository } from '../../src/repository/UserRepository';


interface SutTypes {
    ecrypter: EncrypterHelper;
    sut: UserRepository;
}

const makeEncrypterStub = (): EncrypterHelper => {
    class EncrypterHelperStub implements EncrypterHelper {
        async encrypt(password: string): Promise<string> {
            return new Promise(resolve =>resolve(password));
        }
        async compare (plaintext: string, digest: string): Promise<boolean>{
            return new Promise(resolve =>resolve(true));
        }
    }
    return new EncrypterHelperStub();
}

const makeSut = (): SutTypes => {
    const ecrypter = makeEncrypterStub();
    const sut = new UserRepository(ecrypter)

    return { sut,  ecrypter }
}


describe('User Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
        const accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.insertOne({
            email: 'valid_mail1@mail.com',
            password_hash: 'valid_password',
            name:'valid_name'
        });

    })
    afterAll(async () => {
        await MongoHelper.disconnect();
        const accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({})
    })

    test('should call encrypter with correct password', async () => {
        const { sut, ecrypter } = makeSut()
        const ecryptSpy = jest.spyOn(ecrypter, 'encrypt')
        const accountData = {
            email: 'valid_mail@mail.com',
            password: 'valid_password',
            name:'any_name'
        }
        
        await sut.registerUser(accountData)
        expect(ecryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('should throw if encrypter throws', async () => {
        const { sut, ecrypter } = makeSut()
        jest.spyOn(ecrypter, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        const promise = sut.registerUser(accountData)
        expect(promise).rejects.toThrow()
    });

    test('should call mongo helper have called', async () => {
        const { sut } = makeSut()
        
        const mongoSpy = jest.spyOn(MongoHelper, 'getCollection');
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        await sut.registerUser(accountData)
        expect(mongoSpy).toHaveBeenCalled();
        expect(mongoSpy).toHaveBeenCalledTimes(1)
    });

    test('should call mongo helper throws', async () => {
        const { sut } = makeSut()
        
        jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
            throw new Error();
        });
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        const promise = sut.registerUser(accountData)
        expect(promise).rejects.toThrow()
    });

    test('should return account', async () => {
        const { sut } = makeSut()
        

        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        const user = await sut.registerUser(accountData);
        expect(user).toBeTruthy()
        expect(user.id).toBeTruthy()
        expect(user.email).toBe('valid_mail@mail.com')
        expect(user.password_hash).toBe('valid_password')
        expect(user.name).toBe('valid_name')
    });

    //singIn

    test('should return null when user is not finded', async () => {
        const { sut, ecrypter } = makeSut()
        const ecryptSpy = jest.spyOn(ecrypter, 'compare')
        const accountData = {
                email: 'valid_mail2@mail.com',
                password: 'valid_password'
            }
            
            const result = await sut.singIn(accountData)
            expect(result).toBeNull();
        })

    test('should return null when user not find', async () => {
        const { sut } = makeSut()

        const user = await sut.findUserByEmail('not_finded_user@email.com');
        expect(user).toEqual(null);
    });

    test('should return account when user exist', async () => {
        const { sut } = makeSut()

        const user = await sut.findUserByEmail('valid_mail1@mail.com');
        expect(user).toBeTruthy();
    });

});
