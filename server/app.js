'use strict';

const dotenv = require('dotenv');
const chalk = require('chalk');
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const busRouter = require('./src/tc-app/bus/bus-router');
const trainRouter = require('./src/tc-app/train/train-router');
const clientRouter = require('./src/tc-client/router');
const localeRouter = require('./src/tc-locale/router');
const stopsRouter = require('./src/tc-app/stops/stops-router');
const { onConnection } = require('./src/utils/socket');
const { logger } = require('./src/utils/logger');
const { Db } = require('./src/utils/db/db');

dotenv.config();
new Db();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: '*', transports: ['websocket'], allowUpgrades: false });

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/v1/api', [busRouter, clientRouter, localeRouter, stopsRouter]);
app.use('/v1/api/train', trainRouter);

io.on('connection', onConnection);

if (process.env.CTA_KEY) {
    httpServer.listen(process.env.PORT, () => {
        console.log('Server started on port', process.env.PORT);
    });
} else {
    console.log(chalk.red('CTA key missing. Failed to start server'));
}
