import { HttRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import DataTransform from '../transforms/DataTransform';
import { WriteFileHelper } from '../helpers/WriteFileHelper';

export class InputDataService {
    private readonly writeFile: WriteFileHelper;

    constructor(writeFile: WriteFileHelper) {
        this.writeFile = writeFile;
    }
    async inputData(data: HttRequest): Promise <HttpResponse> {
        try {
            const { body } = data;
            const requiredFields = ['complete_name', 'birth_date', 'cpf', 'rg'];
            for(const field of requiredFields){
                if(!body[field]){
                    return {
                        statusCode: 400,
                        body: new Error(`${field} is required`)
                    }
                }
            }
            const dataToSaveInFile = DataTransform(body);

            if(!this.writeFile.verifyIfFileExist()){

                this.writeFile.writeFile(dataToSaveInFile);
                return new Promise(resolve => resolve({
                    statusCode: 200,
                    body: {message: 'write file'}
                }))
            }

            this.writeFile.appendFile(dataToSaveInFile);
            return {
                statusCode: 200,
                    body: {message: 'write file'}
            }

        }catch(e){
            return {
                statusCode: 500,
                body: new Error('internal server error')
            }
        }
    }
}
