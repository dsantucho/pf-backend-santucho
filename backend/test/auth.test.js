const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app'); // Asegúrate de que la ruta a tu archivo de entrada principal sea correcta

const expect = chai.expect;
const requester = supertest(app);

// Conecta a la base de datos de prueba
before((done) => {
    mongoose.connect('mongodb+srv://dsantucho:coder123456@proyectofinalbk.syalrvk.mongodb.net/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => done())
        .catch(err => done(err));
});

describe('Testing Auth API', function() {
 // Aumenta el tiempo de espera a 5000ms (5 segundos)
    this.timeout(5000);

    let sessionCookie;
    let userId;

    // Test para el login
    it('POST /auth/login - should login and return a session cookie', async function() {
        const mockUser = {
            email: 'soledadsantucho@hotmail.com',
            password: '123456'
        };

        const loginRes = await requester.post('/auth/login').send(mockUser);
        const cookies = loginRes.headers['set-cookie'];
        console.log("COOKIE: ", cookies);

        // Extraer solo el valor de la cookie de sesión
        sessionCookie = cookies.find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
        console.log('SESSION COOKIE: ', sessionCookie);

        // Verificar que la respuesta sea una redirección a /products
        expect(loginRes.statusCode).to.equal(302);
        expect(loginRes.headers.location).to.equal('/products');

    });
});

// Cierra la conexión de Mongoose después de las pruebas
after((done) => {
    mongoose.connection.close()
        .then(() => done())
        .catch(err => done(err));
});