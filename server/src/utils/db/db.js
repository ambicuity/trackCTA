'use strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

class Db {
    constructor() {
        (async () => {
            try {
                await mongoose.connect(process.env.DB_CONNECTION_STR);
                console.log('MongoAtlas Connected...');
            } catch (err) {
                console.log(err);
            }
        })();
    }
}

module.exports = {
    Db,
};
