import { UserRepository  as UserRepositoryProtocol} from '../protocols/UserRepository';
import { EncrypterHelper } from '../protocols/EncrypterHelper'
import { CreateUser } from '../types/CreateUser';
import { User } from '../models/User';
import { SignInUser } from 'types/SignInUser'
import { LoggedUser } from '../types/LoggedUser';
import { MongoHelper } from '../helpers/MongoHelper';
export class UserRepository implements UserRepositoryProtocol {
    private readonly encrypter: EncrypterHelper
    constructor(encrypter: EncrypterHelper) {
        this.encrypter = encrypter;
    }

    async registerUser(userData: CreateUser): Promise<User>{
        const passwordHash = await this.encrypter.encrypt(userData.password);
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(Object.assign({},{ password_hash: passwordHash, name:userData.name, email:userData.email }))
        return MongoHelper.map(result.ops[0]);
    }
    async singIn(singIn: SignInUser): Promise<LoggedUser>{
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.findOne({ email: singIn.email })
        if(!result){
            return null;
        }
        const isValid = this.encrypter.compare(singIn.password, result.password_hash);
        if(!isValid){
            return null;
        }
        return MongoHelper.map(result);
    }

    async findUserByEmail(email: string): Promise<User>{
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.findOne({ email });
        return result;
    }
}
