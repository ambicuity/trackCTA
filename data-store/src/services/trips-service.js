'use strict';

const Trip = require('../models/trips');
const Logger = require('../utils/logger');

const insertTrips = async (tripData, db) => {
    const logger = new Logger('insertTrips');
    logger.begin();

    try {
        await db.dropCollection('trips');

        const groupByRouteShape = tripData.reduce((acc, trip) => {
            const routeShapeId = `${trip.route_id}-${trip.shape_id}`;
            if (!acc[routeShapeId]) {
                acc[routeShapeId] = {
                    id: routeShapeId,
                    tripId: trip.trip_id,
                    shapeId: trip.shape_id,
                    routeId: trip.route_id,
                    directionId: trip.direction_id,
                    direction: trip.direction,
                    wheelchairBoarding: trip.wheelchair_accessible,
                };
            }

            return acc;
        }, {});

        const trips = Object.values(groupByRouteShape);
        db.watchCollection('trips', trips.length);
        await Trip.insertMany(trips);

        logger.success();
    } catch (err) {
        logger.fail();
        throw err;
    }
};

module.exports = {
    insertTrips,
};
