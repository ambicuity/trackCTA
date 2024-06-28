'use strict';

const axios = require('axios');
const chalk = require('chalk');
const dotenv = require('dotenv');

const { mapStatusToColor } = require('./logger');

dotenv.config();

const Transit = {
    Bus: 0,
    Train: 1,
};
const busResponseKey = 'bustime-response';
const trainResponseKey = 'ctatt';
const TransitHttpProps = {
    [Transit.Bus]: {
        baseURL: process.env.CTA_BASE_URL,
        params: {
            key: process.env.CTA_KEY,
            format: 'json',
        },
    },
    [Transit.Train]: {
        baseURL: process.env.CTA_TRAIN_BASE_URL,
        params: {
            key: process.env.CTA_TRAIN_KEY,
            outputType: 'json',
        },
    },
};

class Http {
    constructor(transit) {
        this.http = axios.create(TransitHttpProps[transit]);

        this.http.interceptors.request.use((config) => {
            config.metadata = { startTime: new Date().getTime() };

            return config;
        });
    }

    assign_response_interceptor(key) {
        this.http.interceptors.response.use((response) => {
            const {
                status,
                request: {
                    res: { responseUrl },
                },
                data,
                config: {
                    metadata: { startTime },
                },
            } = response;
            const responseTime = new Date().getTime() - startTime;
            const formattedDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
            const ctaResponse = data[key];
            const error = ctaResponse['error'];

            if (error) {
                console.log(chalk.red(error[0].msg));

                return { error: error[0].msg };
            }

            console.log(
                `${chalk.blue(formattedDateTime)} GET ${responseUrl} ${mapStatusToColor(status)} ${chalk.yellow(
                    `${responseTime}ms`,
                )}`,
            );

            return { data: ctaResponse };
        });
    }

    get_bus_http() {
        this.assign_response_interceptor(busResponseKey);
        return this.http;
    }

    get_train_http() {
        this.assign_response_interceptor(trainResponseKey);
        return this.http;
    }
}

const BusHttp = new Http(Transit.Bus).get_bus_http();
const TrainHttp = new Http(Transit.Train).get_train_http();

module.exports = {
    BusHttp,
    TrainHttp,
};
