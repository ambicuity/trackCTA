'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShapeSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    seq: [
        {
            id: {
                type: String,
                required: true,
            },
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
            distanceTravelled: {
                type: Number,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model('Shape', ShapeSchema, 'shapes');
