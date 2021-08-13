
export default (data: any): string =>{
    const { inputedUser, loggedUser } = data;
    const inputedUserKey = Object.keys(inputedUser);
    const loggedUserKey = Object.keys(loggedUser);
    const inputedUserString = mapStringToReturn(inputedUserKey, inputedUser);
    const loggedUserString = mapStringToReturn(loggedUserKey, loggedUser);
    return inputedUserString+loggedUserString;
};

const mapStringToReturn =(keys: string[], data: any) => {
    let stringToSaveData = ''
    for(const key of keys){
        stringToSaveData+= `${key}: ${data[key]}\n`
    }
    stringToSaveData+='\n';
    return stringToSaveData;
}


