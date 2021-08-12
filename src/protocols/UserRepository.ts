import { User } from '../models/User'
import { CreateUser } from '../types/CreateUser'
import { SignInUser } from '../types/SignInUser'
import { LoggedUser } from '../types/LoggedUser'

export interface UserRepository  {
    registerUser(userData: CreateUser): Promise<User>;
    singIn(singIn: SignInUser): Promise<LoggedUser>;
}
