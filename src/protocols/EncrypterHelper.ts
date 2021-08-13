export interface EncrypterHelper {
    encrypt(password): Promise<string>;
    compare (plaintext: string, digest: string): Promise<boolean>;
}
