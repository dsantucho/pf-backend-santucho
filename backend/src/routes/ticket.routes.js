const express = require('express');
const router = express.Router();
const { createTicket,findTicketById } = require('../controllers/ticket.controller');

router.post('/', createTicket);
router.get('/', findTicketById);

module.exports = router;
