import { MongoHelper as sut } from '../../../src/helpers/MongoHelper'

describe('Mongo Helper', () =>{
    beforeAll(async () =>{
        console.log(process.env.MONGO_URL);
        await sut.connect(process.env.MONGO_URL)
    });

    afterAll(async () => {
        await sut.disconnect()
    });


    test('should reconnect if mongo db is down', async () =>{
        let accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
        await sut.disconnect()
        accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
    });
});
