'use strict';

const Shape = require('../models/shapes');
const Logger = require('../utils/logger');

const insertShapes = async (shapesData, db) => {
    const collectionName = 'shapes';
    const logger = new Logger('insertShapes');
    logger.begin();

    try {
        await db.dropCollection(collectionName);

        const groupByShapeId = shapesData.reduce((acc, shape) => {
            if (!acc[shape.shape_id]) {
                acc[shape.shape_id] = {
                    id: shape.shape_id,
                    paths: [],
                };
            }

            acc[shape.shape_id].paths.push({
                lat: parseFloat(shape.shape_pt_lat),
                lng: parseFloat(shape.shape_pt_lon),
            });

            return acc;
        }, {});

        const shapes = Object.values(groupByShapeId);

        db.watchCollection(collectionName, shapes.length);

        await Shape.insertMany(shapes);

        logger.success();
    } catch (err) {
        logger.fail();
        throw err;
    }
};

module.exports = {
    insertShapes,
};
