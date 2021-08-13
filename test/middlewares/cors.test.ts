import request from 'supertest';
import app from '../../src/config/app'

describe('Cors Middleware', () => {
    test('should enable cors ', async () => {
        app.post('/test_cors', (request, response)=>{
            response.send()
        })
        await request(app)
            .post('/test_cors')
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-headers', '*')
    })
});
