// src/controllers/ticket.controller.js
const Ticket = require('../modules/ticket.model');

const createTicket = async (req, res) => {
    const { cartId, amount, purchaser, userId } = req.body;

    try {
        const ticket = new Ticket({
            amount,
            purchaser,
            cartId,
            userId
        });
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Buscar un ticket por ID
const findTicketById = async(req, res) =>{
    const { ticketId } = req.body;
    try {
        const ticket = await Ticket.findById(ticketId);
        return ticket;
    } catch (error) {
        throw new Error('Error al buscar el ticket: ' + error.message);
    }
}

module.exports = {
    createTicket,
    findTicketById
};
