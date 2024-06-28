'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Stop = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number],
    },
    wheelchairBoarding: {
        type: Number,
    },
    type: {
        type: String,
        enum: ['B', 'T'],
        required: true,
    },
    childStops: {
        type: [Object],
    },
    ada: {
        type: Boolean,
        default: false,
    },
    red: {
        type: Boolean,
        default: false,
    },
    blue: {
        type: Boolean,
        default: false,
    },
    green: {
        type: Boolean,
        default: false,
    },
    brown: {
        type: Boolean,
        default: false,
    },
    purple: {
        type: Boolean,
        default: false,
    },
    pexp: {
        type: Boolean,
        default: false,
    },
    yellow: {
        type: Boolean,
        default: false,
    },
    pink: {
        type: Boolean,
        default: false,
    },
    orange: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Stop', Stop, 'stops');
