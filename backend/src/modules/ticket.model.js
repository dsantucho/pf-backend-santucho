const mongoose = require('mongoose');
const { generateRandomNumbers } = require('../config/generateRandomNumbers');

// Define el esquema del modelo Ticket
const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

// Antes de guardar el ticket, genera el código único
ticketSchema.pre('save', function(next) {
    // Genera el código único llamando a la función generateRandomNumbers
    const code = generateRandomNumbers(8).join(''); // Genera un código de 8 dígitos concatenando los números generados
    this.code = code;
    next();
});

// Crea el modelo Ticket a partir del esquema definido
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
