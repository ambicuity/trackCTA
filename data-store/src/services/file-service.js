'use strict';

require('dotenv').config();
const csvtojsonV2 = require('csvtojson');
const fs = require('fs');

const readStopsFile = async () => {
    console.log('>>> Reading data/stops.csv');
    const allStops = await csvtojsonV2().fromFile('data/stops.csv');

    console.log('>>> Reading data/train-stops.json');
    const trainStops = JSON.parse(await fs.readFileSync('data/train-stops.json'));

    return { allStops, trainStops };
};

const readTripsFile = async () => {
    console.log('>>> Reading data/trips.csv');
    const trips = await csvtojsonV2().fromFile('data/trips.csv');

    return { trips };
};

const readShapesFile = async () => {
    console.log('>>> Reading data/shapes.csv');
    const shapes = await csvtojsonV2().fromFile('data/shapes.csv');

    return { shapes };
};

module.exports = {
    readStopsFile,
    readTripsFile,
    readShapesFile,
};
