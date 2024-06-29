// src/routes/payment.routes.js
const express = require('express');
const router = express.Router();
const stripe = require('../config/stripeConfig');

router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(amount, 10), // Convertir el monto a entero
            currency: 'usd',
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
