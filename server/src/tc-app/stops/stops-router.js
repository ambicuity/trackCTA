'use strict';

const express = require('express');
const Fuse = require('fuse.js');

const { getClosestStops } = require('./stops-service');

const paginate = (array, limit, index) => {
    return array.slice((index - 1) * limit, index * limit);
};

const router = express.Router();

router.get('/closest-stops', async (req, res) => {
    try {
        const stops = await getClosestStops();
        console.log(stops.length)
        res.send(stops);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
