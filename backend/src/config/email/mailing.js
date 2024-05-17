const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "soledadsantucho@gmail.com",
    pass: "vkbvgweytyuvycoh",
  },
});

module.exports = transporter;