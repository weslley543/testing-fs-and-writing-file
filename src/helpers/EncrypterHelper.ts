import bcrypt from 'bcrypt'
import { EncrypterHelper as Encrypter } from '../protocols/EncrypterHelper';

export class EncrypterHelper implements Encrypter{
    private readonly salt: number;
    constructor(salt: number){
        this.salt = salt;
    }
    async encrypt(value: string): Promise <string> {
        const hash = await bcrypt.hash(value, this.salt);
        return hash;
    }
    async compare (plaintext: string, digest: string): Promise<boolean>{
        return bcrypt.compare(plaintext, digest)
    }
}
