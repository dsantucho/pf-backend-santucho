const generateProductErrorInfoSP = (product) => {
    console.log(product)
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        -> title: type String, recibido: ${product.title}
        -> price: type numero, recibido: ${product.price}
        -> code: type String, recibido: ${product.code}
        -> stock: type numero, recibido: ${product.stock}
        -> category: type String ['Hogar', 'Tecnologia', 'Cocina','Higiene'], recibido: ${product.category}
`;
}

module.exports = {
    generateProductErrorInfoSP,
};
