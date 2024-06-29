require('dotenv').config();
//const dotenv = require('dotenv');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
module.exports = stripe;