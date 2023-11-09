const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transport.sendMail(email);
};

module.exports = sendEmail;
