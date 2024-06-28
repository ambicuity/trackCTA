'use strict';

const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');

const { cache, cacheKeys } = require('../utils/cache');

dotenv.config();

const getLocaleJson = async (ns, lng) => {
    if (process.env.NODE_ENV === 'development' && ns === 'common' && lng === 'en') {
        return { data: fs.readFileSync('./src/tc-locale/locales/common_en.json'), status: 200 };
    }

    if (process.env.NODE_ENV === 'development' && ns === 'faq' && lng === 'en') {
        return { data: fs.readFileSync('./src/tc-locale/locales/faq_en.json'), status: 200 };
    }

    if (process.env.NODE_ENV === 'development' && ns === 'client' && lng === 'en') {
        return { data: fs.readFileSync('./src/tc-locale/locales/client_en.json'), status: 200 };
    }

    const key = cacheKeys.locale(ns, lng);
    const value = cache.get(key);

    if (value) {
        cache.log_hit(key);
        return Promise.resolve(value);
    }

    const { data, status } = await axios.get(`${process.env.LOCALE_URL}/${ns}/${lng}.json`);

    cache.log_miss(key);
    cache.set(key, { data, status });

    return { data, status };
};

module.exports = {
    getLocaleJson,
};
