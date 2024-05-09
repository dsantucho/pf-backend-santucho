const mongoose = require('mongoose');
const { generateRandomNumbers } = require('../config/generateRandomNumbers');

// Define el esquema del modelo Ticket
const ticketSchema = new mongoose.Schema({
    code: { 
        type: String, 
        unique: true, 
        //default: generateRandomNumbers(8).join('')
    },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number },
    purchaser: { type: String}
});

// Antes de guardar el ticket, generamos un código único
ticketSchema.pre('save', function(next) {
    if (!this.code) {
        // Generar un nuevo código único
        this.code = generateRandomNumbers(8).join('');
    }
    next();
});

const Ticket = mongoose.model('ticket', ticketSchema);
module.exports = Ticket;