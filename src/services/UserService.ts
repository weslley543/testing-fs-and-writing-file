import { HttRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { EmailValidatorHelper } from '../protocols/EmailValidatorHelper';
import {  UserRepository } from '../protocols/UserRepository';

export class UserService {
    private readonly emailValidator: EmailValidatorHelper;
    private readonly userRepository: UserRepository;
    constructor(emailValidator: EmailValidatorHelper, userRepository: UserRepository){
        this.emailValidator = emailValidator;
        this.userRepository = userRepository;
    }

    async registerUser(httpRequest: HttRequest): Promise<HttpResponse>{
        try{
            const { body } = httpRequest;
            const requiredFields = ['email', 'name', 'password', 'password_confirmation'];

            for(const field of requiredFields){
                if(!body[field]){
                    return {
                        statusCode:400,
                        body: new Error(`${field} is required`)
                    }
                }
            }
            if(body.password !== body.password_confirmation){
                return {
                    statusCode:400,
                    body: new Error('passwords must be equals')
                }
            }
            const isValid = this.emailValidator.isValid(body.email);
            if(!isValid){
                return {
                    statusCode:400,
                    body: new Error('email is not valid')
                }
            }
            const userExist = await this.userRepository.findUserByEmail(body.email);

            if(userExist){
                return  {
                    statusCode: 400,
                    body: new Error('user already exists')
                }
            }

            const account = await this.userRepository.registerUser({
                name: body.name,
                email: body.email,
                password: body.password
            })
            return {
                statusCode: 200,
                body: account
            };
        }catch(e){
            return {
                statusCode:500,
                body: new Error('internal server error')
            }
        }
    }
    async singIn(httpRequest: HttRequest): Promise<HttpResponse>{
        try{
            const { body } = httpRequest;
            const requiredFields = ['email', 'password'];

            for(const field of requiredFields){
                if(!body[field]){
                    return {
                        statusCode:400,
                        body: new Error(`${field} is required`)
                    }
                }
            }

            const isValid = this.emailValidator.isValid(body.email);
            if(!isValid){
                return {
                    statusCode:400,
                    body: new Error('email is not valid')
                }
            }
            const account = await this.userRepository.singIn({
                email: body.email,
                password: body.password
            });

            if(!account){
                return {
                    statusCode: 400,
                    body: new Error('user is not find')
                };
            }
            return {
                statusCode: 200,
                body: account
            };
        }catch(e){
            return {
                statusCode:500,
                body: new Error('internal server error')
            };
        }
    }
}
