const Ticket = require('../modules/ticket.model'); // Importar el modelo de Ticket

class TicketDao {
    constructor() {}

    // Crear un nuevo ticket
    async createTicket(amount, purchaser) {  
        try {
            const ticket = new Ticket({
                amount,
                purchaser,
            });
            console.log('TICKET: ',ticket)
            let createTicket = await Ticket.create(ticket);
            return createTicket;
        } catch (error) {
            throw new Error('Error al crear el ticket: ' + error.message);
        }
    }

    // Buscar un ticket por ID
    async findTicketById(ticketId) {
        try {
            const ticket = await Ticket.findById(ticketId);
            return ticket;
        } catch (error) {
            throw new Error('Error al buscar el ticket: ' + error.message);
        }
    }

}

module.exports = TicketDao;
