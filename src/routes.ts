import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { InputDataController } from './controllers/InputDataController'
import authmiddlaware from './middlewares/authmiddlaware';

const inputDataController = new InputDataController();
const userController = new UserController();

const route = Router();



route.post('/register_user', userController.registerUser);
route.post('/sing_in', userController.singIn);

route.post('/input_data', authmiddlaware ,inputDataController.inputData);

export default route;
