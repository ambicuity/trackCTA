'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShapeSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    paths: [
        {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model('Shape', ShapeSchema, 'shapes');
