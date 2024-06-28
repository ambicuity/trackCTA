'use strict';

const NodeCache = require('node-cache');

const cacheKeys = {
    locale: (ns, lng) => `locale-${ns}-${lng}-cache`,
    routes: 'routes-cache',
    pattern: (route) => `pattern-${route}-cache`,
    direction: (route) => `dir-${route}-cache`,
    stops: (route, dir) => `stops-${route}-${dir}-cache`,
    trainStops: (route) => `train-stops-${route}-cache`,
    trainRoutes: 'train-routes-cache',
};

const ttl = 60 * 60 * 24;

class Cache {
    constructor() {
        this.cache = new NodeCache({ stdTTL: ttl, checkperiod: ttl * 0.2, useClones: false });
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value) {
        this.cache.set(key, value);
        this.log_stats();
    }

    log_stats() {
        console.info(this.cache.getStats());
    }

    log_hit(key) {
        this.log_stats();
        console.info(`Cache Hit: ${key}`);
    }

    log_miss(key) {
        console.info(`Cache Miss: ${key}`);
    }
}

const cache = new Cache();

module.exports = {
    cache,
    Cache,
    cacheKeys,
};
