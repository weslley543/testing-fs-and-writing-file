import { WriteFileHelper as WriteFileHelperProtocol } from '../protocols/WriteFileHelper';
import * as fs from 'fs'
import InputedUserAndLoggedUserTransform from '../transforms/InputedUserAndLoggedUserTransform'

export class WriteFileHelper implements WriteFileHelperProtocol{
    private path: string;
    constructor(path: string){
        this.path = path;
    }
    verifyIfFileExist(): boolean {
        try{
            return fs.existsSync(this.path) ? true : false;
        }catch(e){
            return false;
        }
    }
    writeFile(data): boolean {
        try{
            const stringToWrite = InputedUserAndLoggedUserTransform(data);
            console.log(data)
            //fs.writeFileSync(this.path, stringToWrite);
            return true;
        }catch(e){
            return false;
        }
    }

    appendFile(data): boolean{
        try{
            const stringToAppend = InputedUserAndLoggedUserTransform(data);
            fs.appendFileSync(this.path, stringToAppend);
            return true
        }catch(e){
            return false
        }
    }
}
