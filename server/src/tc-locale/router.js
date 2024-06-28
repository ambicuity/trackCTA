'use strict';

const express = require('express');

const { getLocaleJson } = require('./service');

const router = express.Router();

router.get('/locale/:ns/:lng', async (req, res) => {
    const { ns, lng } = req.params;

    try {
        const { data } = await getLocaleJson(ns, lng);

        res.send(data).status(200);
    } catch (err) {
        console.log(err);
        res.send(fs.readFileSync('src/locales/common_en.json')).status(200);
    }
});

module.exports = router;
