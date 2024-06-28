'use strict';

const axios = require('axios');
const dotenv = require('dotenv');

const { cache, cacheKeys } = require('../../utils/cache');
const { BusHttp: Http } = require('../../utils/http');

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const getRoutes = async () => {
    const key = cacheKeys.routes;
    const routes = cache.get(key);

    if (routes) {
        cache.log_hit(key);
        return routes;
    }

    const { data, error } = await Http.get(`/getroutes`);

    if (error) {
        throw error;
    }

    cache.log_miss(key);
    cache.set(key, data['routes']);

    return data['routes'];
};

const getVehicles = async (routes) => {
    const { data, error } = await Http.get('/getvehicles', {
        params: { rt: routes },
    });

    if (error) {
        throw error;
    }

    return data['vehicle'];
};

const getPatterns = async (route) => {
    const key = cacheKeys.pattern(route);
    const pattern = cache.get(key);

    if (pattern) {
        cache.log_hit(key);
        return pattern;
    }

    const { data, error } = await Http.get('/getpatterns', {
        params: { rt: route },
    });

    if (error) {
        throw error;
    }

    cache.log_miss(key);
    cache.set(key, data['ptr']);

    return data['ptr'];
};

const getPredictions = async (stop) => {
    const { data, error } = await Http.get('/getpredictions', {
        params: { stpid: stop },
    });

    if (error) {
        throw error;
    }

    return data['prd'];
};

const getRouteDirections = async (route) => {
    const key = cacheKeys.direction(route);
    const directions = cache.get(key);

    if (directions) {
        cache.log_hit(key);
        return directions;
    }

    const { data, error } = await Http.get('/getdirections', {
        params: { rt: route },
    });

    if (error) {
        throw error;
    }

    const response = data['directions'].map((dir) => dir.dir);

    cache.log_miss(key);
    cache.set(key, response);

    return response;
};

const getStops = async (route, direction) => {
    const key = cacheKeys.stops(route, direction);
    const stops = cache.get(key);

    if (stops) {
        cache.log_hit(key);
        return stops;
    }

    const { data, error } = await Http.get('/getstops', {
        params: { rt: route, dir: direction },
    });

    if (error) {
        throw error;
    }

    const response = { direction, route, stops: data['stops'] };
    cache.log_miss(key);
    cache.set(key, response);

    return response;
};

const getGitHubWorkflow = async () => {
    const [{ data: web }, { data: server }] = await Promise.all([
        axios.get(process.env.GITHUB_WORKFLOW_WEB_URL, { headers: { Authorization: `token ${GITHUB_TOKEN}` } }),
        axios.get(process.env.GITHUB_WORKFLOW_SERVER_URL, { headers: { Authorization: `token ${GITHUB_TOKEN}` } }),
    ]);

    return { web, server };
};

const getLatestVersion = async () => {
    const { data } = await axios.get(process.env.GITHUB_VERSION_URL, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    return data.tag_name;
};

module.exports = {
    getGitHubWorkflow,
    getLatestVersion,
    getPatterns,
    getPredictions,
    getRoutes,
    getVehicles,
    getRouteDirections,
    getStops,
};
