// test/product.test.cjs
const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const crypto = require('crypto');
//const app = require('../src/app.js'); // Asegúrate de que la ruta a tu archivo de entrada principal sea correcta

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

// Conecta a la base de datos de prueba
before((done) => {
    mongoose.connect('mongodb+srv://dsantucho:coder123456@proyectofinalbk.syalrvk.mongodb.net/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => done())
        .catch(err => done(err));
});

describe('Testing Products API', () => {
    let testProductId;
    let sessionCookie;

    // Registro y login de usuario antes de los tests
    before(async () => {
        const mockUser = {
            email: 'soledadsantucho@hotmail.com',
            password: '123456',
            //role: 'admin' // o 'premium' dependiendo de tus pruebas
        };

        // Login de usuario
        const loginRes = await requester.post('/auth/login').send(mockUser);
        const cookies = loginRes.headers['set-cookie'];
        sessionCookie = cookies.find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
    });
    // Función para generar un código aleatorio
    function generateRandomCode() {
        return crypto.randomBytes(4).toString('hex'); // Genera un código aleatorio de 8 caracteres (4 bytes en hexadecimal)
    }

    // Test para crear un nuevo producto
    it('POST /api/products - should create a new product', async () => {
        const productMock = {
            title: "New Product",
            description: "Product description",
            price: 100,
            code: generateRandomCode(), // Genera un código aleatorio
            stock: "50",
            category: "Tecnologia"
        };

        const res = await requester.post('/api/products')
            .send(productMock)
            .set('Cookie', sessionCookie) // Incluye el token de autenticación en la cookie
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(201);
        expect(res.body).to.have.property('_id');
        testProductId = res.body._id; // Guarda el ID del producto para usarlo en otros tests
        console.log('ID NEW PRODUCT:', testProductId)
    });

    // Test para obtener todos los productos
    it('GET /api/products - should get all products', async () => {
        const res = await requester.get('/api/products')
            .set('Cookie', sessionCookie) // Incluye el token de autenticación
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('payload').that.is.an('array');
    });

    // Test para obtener un producto por ID
    it('GET /api/products/:pid - should get a product by id', async () => {
        const res = await requester.get(`/api/products/${testProductId}`)
            .set('Cookie', sessionCookie) // Incluye el token de autenticación
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id').eql(testProductId);
    });

    // Test para actualizar un producto
    it('PUT /api/products/:pid - should update a product', async () => {
        let updatePrice = 150
        const updatedProduct = {
            title: "Updated Product",
            price: updatePrice
        };

        const res = await requester.put(`/api/products/${testProductId}`)
            .send(updatedProduct)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('title').eql('Updated Product');
        expect(res.body).to.have.property('price').eql(updatePrice);
    });

    // Test para eliminar un producto
    it('DELETE /api/products/:pid - should delete a product', async () => {
        const res = await requester.delete(`/api/products/${testProductId}`)
            .set('Cookie', sessionCookie) // Incluye el token de autenticación
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
    });
});

// Cierra la conexión de Mongoose después de las pruebas
after((done) => {
    mongoose.connection.close()
        .then(() => done())
        .catch(err => done(err));
});