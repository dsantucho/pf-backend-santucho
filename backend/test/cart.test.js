const chai = require('chai');
const supertest = require('supertest');
const crypto = require('crypto');

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Carts API', () => {
    let testCartId;
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

    // Test para crear un nuevo carrito
    it('POST /api/carts - should create a new cart', async () => {
        const res = await requester.post('/api/carts')
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(201);
        expect(res.body).to.have.property('data');
        testCartId = res.body.data; // Guarda el ID del carrito para usarlo en otros tests
    });

    // Test para listar los productos de un carrito
    it('GET /api/carts/:cid - should get cart by id', async () => {
        const res = await requester.get(`/api/carts/${testCartId}`)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    // Test para agregar un producto a un carrito
    it('POST /api/carts/:cid/product/:pid - should add a product to the cart', async () => {
        const productMock = {
            title: "Test Product",
            description: "Product description",
            price: 100,
            code: crypto.randomBytes(4).toString('hex'), // Genera un código aleatorio
            stock: "50",
            category: "Tecnologia"
        };

        // Crear un producto para agregar al carrito
        const productRes = await requester.post('/api/products')
            .send(productMock)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        const productId = productRes.body._id;

        const res = await requester.post(`/api/carts/${testCartId}/product/${productId}`)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message').eql('Producto agregado al carrito');
    });

    // Test para actualizar la cantidad de un producto en el carrito
    it('PUT /api/carts/:cid/products/:pid - should update the product quantity in the cart', async () => {
        const productMock = {
            title: "Test Product for Quantity",
            description: "Product description",
            price: 100,
            code: crypto.randomBytes(4).toString('hex'), // Genera un código aleatorio
            stock: "50",
            category: "Tecnologia"
        };

        // Crear un producto para agregar al carrito
        const productRes = await requester.post('/api/products')
            .send(productMock)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        const productId = productRes.body._id;

        // Agregar el producto al carrito
        await requester.post(`/api/carts/${testCartId}/product/${productId}`)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        // Actualizar la cantidad del producto en el carrito
        const updatedQuantity = { quantity: 5 };
        const res = await requester.put(`/api/carts/${testCartId}/products/${productId}`)
            .send(updatedQuantity)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message').eql('Se actualizo el quantity');
    });

    // Test para eliminar un producto del carrito
    it('DELETE /api/carts/:cid/product/:pid - should remove a product from the cart', async () => {
        const productMock = {
            title: "Test Product for Deletion",
            description: "Product description",
            price: 100,
            code: crypto.randomBytes(4).toString('hex'), // Genera un código aleatorio
            stock: "50",
            category: "Tecnologia"
        };

        // Crear un producto para agregar al carrito
        const productRes = await requester.post('/api/products')
            .send(productMock)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        const productId = productRes.body._id;

        // Agregar el producto al carrito
        await requester.post(`/api/carts/${testCartId}/product/${productId}`)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        // Eliminar el producto del carrito
        const res = await requester.delete(`/api/carts/${testCartId}/product/${productId}`)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message').eql('Producto removido del carrito');
    });

    // Test para eliminar todos los productos del carrito
    it('DELETE /api/carts/:cid - should remove all products from the cart', async () => {
        const res = await requester.delete(`/api/carts/${testCartId}`)
            .set('Cookie', sessionCookie)
            .set('Accept', 'application/json');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message').eql('Se eliminaro todos los productos del carrito');
    });
});
