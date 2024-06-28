'use strict';

const cliProgress = require('cli-progress');
const mongoose = require('mongoose');

const Logger = require('./logger');

const multiBar = new cliProgress.MultiBar(
    {
        clearOnComplete: false,
        hideCursor: true,
        format: '{bar} | {name} | {value}/{total} ({percentage}%) ',
    },
    cliProgress.Presets.shades_grey,
);

class Db {
    constructor(processes) {
        this.client = {};
        this.connection = {};
        this.processes = processes.reduce(
            (acc, item) => ({
                ...acc,
                [item]: {
                    complete: false,
                    progress: null,
                },
            }),
            {},
        );

        console.log(this.processes);
    }

    async init() {
        try {
            this.client = await mongoose.connect(process.env.DATABASE_URL);

            console.log('>>> MongoAtlas connected...');

            this.connection = this.client.connection;
        } catch (err) {
            throw err;
        }
    }

    closeConnection() {
        if (Object.values(this.processes).every((p) => p.complete === true)) {
            multiBar.stop();
            process.exit();
        }
    }

    watchCollection(name, total) {
        let count = 0;
        this.processes[name].progress = multiBar.create(total, 0, {
            name,
        });

        this.connection
            .collection(name)
            .watch()
            .on('change', () => {
                this.processes[name].progress.increment();
                count += 1;
                
                if (count === total) {
                    this.processes[name].complete = true;
                    this.closeConnection();
                }
            });
    }

    async dropCollection(collectionName) {
        const logger = new Logger(`dropCollection "${collectionName}"`);

        logger.begin();

        return new Promise((resolve, reject) => {
            this.connection.dropCollection(collectionName, (err) => {
                if (err) {
                    logger.fail();
                    reject(err);
                } else {
                    logger.success();
                    resolve();
                }
            });
        });
    }
}

module.exports = Db;
