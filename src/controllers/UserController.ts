import { Request, Response } from 'express';
import UserServiceFactory from '../factory/UserServiceFactory';
import jwt from 'jsonwebtoken';
import authConfig from '../config/authconfig';

export class UserController {
    async registerUser(request: Request, response: Response){
        const userService = UserServiceFactory();
        const result = await userService.registerUser(request);
        return response.status(result.statusCode).json(result.body);
    }

    async singIn(request: Request, response: Response){
        const userService = UserServiceFactory();
        const result = await userService.singIn(request);

        if(result.statusCode === 200){
            const token = jwt.sign({ id: result.body.id, email: result.body.email }, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            });
            result.body = {...result.body, token}
        }
        return response.status(result.statusCode).json(result.body);
    }
}
