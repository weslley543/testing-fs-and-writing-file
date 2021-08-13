export interface WriteFileHelper {
    writeFile(data): boolean;
    verifyIfFileExist(): boolean;
    appendFile(data): boolean;
}
