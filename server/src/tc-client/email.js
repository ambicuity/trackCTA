'use strict';

const SendGrid = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendMailToGmail = async (email, message) => {
    const response = await SendGrid.send({
        to: process.env.EMAIL,
        from: {
            email: 'contact@trackcta.com',
            name: 'Contact @ trackCTA',
        },
        templateId: 'd-7bf37a82f3464eb091473fdd0f3b1b0b',
        dynamicTemplateData: {
            email,
            message,
        },
        subject: 'A new message from trackCTA contact form!',
    });

    return response;
};

module.exports = {
    sendMailToGmail,
};
