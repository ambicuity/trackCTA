'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TripSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    routeId: {
        type: String,
        required: true,
    },
    serviceId: {
        type: String,
        required: true,
    },
    scheduleTripId: {
        type: String,
        required: true,
    },
    directionId: {
        type: String,
        required: true,
    },
    blockId: {
        type: String,
        required: true,
    },
    shapeId: {
        type: String,
        required: true,
    },
    direction: {
        type: String,
        enum: ['North', 'South', 'East', 'West', '0', '1'],
    },
    wheelchairBoarding: {
        type: String,
    },
});

module.exports = mongoose.model('Trip', TripSchema, 'trips');
