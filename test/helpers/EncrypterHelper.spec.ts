import bcrypt from 'bcrypt';
import { EncrypterHelper } from '../../src/helpers/EncrypterHelper'

const salt = 8

jest.mock('bcrypt', () => ({
    async hash (): Promise<string>{
        return new Promise(resolve => resolve('hash'))
    }
}))

const makeSut = (): EncrypterHelper => {
    return new EncrypterHelper(salt)
}

describe('EncrypterHelper', ()=>{
    test('should call bcrypt with correct value', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
    test('should return a hash on success', async () => {
        const sut = makeSut()
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('hash')
    })
    test('should throw if a bcrypt throws', async () => {
        const sut = makeSut()
        // @ts-ignore
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error)))
        const promise = sut.encrypt('any_value')
        await expect(promise).rejects.toThrow()
    })
})