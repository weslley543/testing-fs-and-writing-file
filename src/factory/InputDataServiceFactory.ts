import { WriteFileHelper } from '../helpers/WriteFileHelper'
import { InputDataService } from '../services/InputDataService';

export default (): InputDataService =>{
    const writeFileHelper = new WriteFileHelper('./file.txt');
    const inputDataService = new InputDataService(writeFileHelper);
    return inputDataService;
};
