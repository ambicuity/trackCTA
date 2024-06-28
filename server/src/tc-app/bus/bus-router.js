'use strict';

const express = require('express');
const Fuse = require('fuse.js');

const {
    getPatterns,
    getRoutes,
    getPredictions,
    getGitHubWorkflow,
    getLatestVersion,
    getRouteDirections,
    getStops,
} = require('./bus-service');

const convertTimestamp = (timestamp) => {
    const [date, time] = timestamp.split(' ');
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${time}`;
};

const paginate = (array, limit, index) => {
    return array.slice((index - 1) * limit, index * limit);
};

const router = express.Router();

router.get('/routes', async (req, res) => {
    try {
        const { search, filter, limit, index } = req.query;

        let data = await getRoutes();

        data = data.map((item) => ({
            route: item.rt,
            name: item.rtnm,
            color: item.rtclr,
            type: 'B',
        }));

        if (filter) {
            const filterRoutes = filter.split(',');

            filterRoutes.forEach((route) => {
                data = data.filter((d) => d.route !== route);
            });
        }

        if (search) {
            const fuse = new Fuse(data, { keys: ['route', 'name'] });
            const searchedRoutes = fuse.search(search);

            data = searchedRoutes.map((f) => f.item);
        }

        const paginatedResponses = paginate(data, limit || 10, index || 1);

        res.send(paginatedResponses);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/route-color', async (req, res) => {
    try {
        const { ids } = req.query;
        const data = await getRoutes();
        const routeToColors = {};

        ids.split(',').forEach((id) => {
            const foundRoute = data.find((r) => r.rt === id.toString());

            if (foundRoute) {
                routeToColors[id] = foundRoute.rtclr;
            }
        });

        res.send(routeToColors);
    } catch (err) {
        console.log(err);
        res.send(err).status(400);
    }
});

router.get('/patterns', async (req, res) => {
    const { route, color } = req.query;
    try {
        const patterns = [];

        const data = await getPatterns(route);

        data.forEach((item) => {
            const paths = [];
            const stops = [];

            item.pt.forEach((p) => {
                if (p.typ === 'W') {
                    paths.push({ lat: p.lat, lng: p.lon, latitude: p.lat, longitude: p.lon });
                } else if (p.typ === 'S') {
                    stops.push({
                        lat: p.lat,
                        lng: p.lon,
                        latitude: p.lat,
                        longitude: p.lon,
                        name: p.stpnm,
                        id: p.stpid,
                        type: 'B',
                        route,
                    });
                }
            });

            patterns.push({
                fillColor: color,
                strokeColor: color,
                dir: item.dir,
                id: item.pid,
                type: 'B',
                route,
                paths,
                stops,
            });
        });

        res.send(patterns);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/predictions', async (req, res) => {
    try {
        let data = await getPredictions(req.query.stop);

        data = data.map((item) => {
            const predTime = convertTimestamp(item.prdtm);
            const reqTime = convertTimestamp(item.tmstmp);
            const diff = Math.round((new Date(predTime) - new Date(reqTime)) / 60000);

            return {
                type: item.typ,
                name: item.stpnm,
                stopId: item.stpid,
                id: item.vid,
                route: item.rt,
                direction: item.rtdir,
                vehicleId: item.vid,
                destination: item.des,
                time: diff,
                timestamp: new Date(predTime).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }),
                delayed: item.dly,
            };
        });

        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/stops', async (req, res) => {
    const { route } = req.query;
    try {
        const directions = await getRouteDirections(route);
        const stopPromises = directions.map((dir) => getStops(route, dir));
        let stops = await Promise.all(stopPromises);
        stops = stops.map((stop) => ({ ...stop, type: 'B' }));

        res.send(stops);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/app-status', async (_, res) => {
    try {
        const data = await getGitHubWorkflow();

        const response = {
            web: data.web.workflow_runs,
            server: data.server.workflow_runs,
        };
        res.send(response);
    } catch (err) {
        res.status(400).send('Failed to update app status');
    }
});

router.get('/version', async (_, res) => {
    try {
        const data = await getLatestVersion();

        res.send(data);
    } catch (err) {
        res.status(400).send('Failed to get version');
    }
});

module.exports = router;
