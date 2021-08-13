import request from 'supertest'
import app from '../../src/config/app';

describe('Body Parser Middleware', () => {
    test('should parse body as a json ', async () => {
        app.post('/test_body_parser', (request, response)=>{
            response.send(request.body)
        });
        await request(app)
            .post('/test_body_parser')
            .send({name: 'weslley'})
            .expect({name: 'weslley'})
    });
});
