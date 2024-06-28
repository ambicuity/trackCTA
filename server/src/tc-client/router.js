'use strict';

const express = require('express');

const { sendMailToGmail } = require('./email');

const router = express.Router();

router.post('/contact', async (req, res) => {
    const { email, message } = req.body;

    try {
        await sendMailToGmail(email, message);

        res.send('Sent!').status(202);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

module.exports = router;
