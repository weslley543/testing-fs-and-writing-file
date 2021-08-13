import { Request, Response } from 'express';
import InputDataServiceFactory from '../factory/InputDataServiceFactory';

export class InputDataController {
    async inputData(request: Request, response: Response){
        const inputDataService = InputDataServiceFactory();
        const result = await inputDataService.inputData(request);
        return response.status(200).json({ok: true});
    }
}
