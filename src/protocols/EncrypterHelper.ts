export interface EncrypterHelper {
    encrypt(password): Promise<String>;
}
