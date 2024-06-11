const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Session API', () => {
    let sessionCookie;

    // Registro y login de usuario antes de los tests
    before(async () => {
        const mockUser = {
            email: 'soledadsantucho@hotmail.com',
            password: '123456'
        };

        // Login de usuario
        const loginRes = await requester.post('/auth/login').send(mockUser);
        const cookies = loginRes.headers['set-cookie'];
        sessionCookie = cookies.find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
    });

    // Test para obtener el usuario actual
    it('GET /api/session/current - should get current user session', async () => {
        const res = await requester.get('/api/session/current')
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('email').eql('soledadsantucho@hotmail.com');
    });

    // Test para obtener el usuario actual sin sesión
    it('GET /api/session/current - should return 401 if no session', async () => {
        const res = await requester.get('/api/session/current')
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property('message').eql('No hay sesión activa');
    });
});
