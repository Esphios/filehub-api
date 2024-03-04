const nodemailer = require('nodemailer');
require('dotenv').config();

// const { GoogleAuth } = require('google-auth-library');
// const fs = require('fs');

export interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Crie um transporte SMTP usando as credenciais
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD   
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendMail = async (mailOptions: MailOptions) => {
    try {
        mailOptions.from = process.env.SMTP_FROM;
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
