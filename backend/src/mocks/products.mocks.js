const { faker } = require('@faker-js/faker/locale/es');



// Definir un conjunto de opciones para la categoría
const categoriasDisponibles = ['Hogar', 'Tecnologia', 'Cocina','Higiene'];

const generateProducts = () =>{
 return {
    title:faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    code: faker.string.alpha(8),
    stock: faker.number.int({min:1 , max: 20}),
    category:faker.helpers.arrayElement(categoriasDisponibles),
    id: faker.database.mongodbObjectId(),
 }
}

module.exports = { generateProducts };