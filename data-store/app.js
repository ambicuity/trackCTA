'use strict';

require('dotenv').config();

const Db = require('./src/utils/db');
const { insertStops } = require('./src/services/stops-service');
const { insertTrips } = require('./src/services/trips-service');
const { insertShapes } = require('./src/services/shapes-service');
const { readStopsFile, readTripsFile, readShapesFile } = require('./src/services/file-service');

const Arguments = ['stops', 'trips', 'shapes'];

const Functions = {
    stops: async (db) => {
        const { allStops, trainStops } = await readStopsFile();
        await insertStops(allStops, trainStops, db);
    },
    trips: async (db) => {
        const { trips } = await readTripsFile();
        await insertTrips(trips, db);
    },
    shapes: async (db) => {
        const { shapes } = await readShapesFile();
        await insertShapes(shapes, db);
    },
};

const start = async () => {
    const args = process.argv.slice(2);
    const promises = [];

    const db = new Db(args.length ? args : Arguments);
    await db.init();

    if (args.length) {
        args.forEach((arg) => {
            if (Arguments.includes(arg)) {
                promises.push(Functions[arg](db));
            } else {
                throw Error(`Invalid argument - ${arg}`);
            }
        });
    } else {
        promises.push(Functions.stops(db));
        promises.push(Functions.trips(db));
        promises.push(Functions.shapes(db));
    }

    await Promise.all(promises);
};

start();
