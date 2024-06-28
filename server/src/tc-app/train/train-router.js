'use strict';

const express = require('express');
const { getRoutes, getPatterns, getStops, getTrains, getArrivals } = require('./train-service');

const router = express.Router();

const convertTimestamp = (timestamp) => {
    const [date, time] = timestamp.split('T');
    return `${date} ${time}`;
};

router.get('/routes', async (req, res) => {
    try {
        const { filter } = req.query;

        let data = await getRoutes();
        data = data.map((item) => ({ ...item, type: 'T' }));

        if (filter) {
            const filterRoutes = filter.split(',');

            filterRoutes.forEach((route) => {
                data = data.filter((d) => d.route !== route);
            });
        }

        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

router.get('/route-color', async (req, res) => {
    try {
        const { ids } = req.query;
        const data = await getRoutes();
        const routeToColors = {};

        ids.split(',').forEach((id) => {
            const foundRoute = data.find((r) => r.route === id.toLowerCase());

            if (foundRoute) {
                routeToColors[id] = foundRoute.color;
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
        const data = await getPatterns(route);
        const stops = await getStops(route);

        const patterns = [];

        data.forEach((item) => {
            const pattern = {
                fillColor: color,
                strokeColor: color,
                id: item.id,
                route,
                paths: [],
                stops: [],
            };

            item.shape.forEach((s) => {
                pattern.paths = s.paths.map((p) => ({ ...p, latitude: p.lat, longitude: p.lng }));
            });

            patterns.push(pattern);
        });

        if (patterns.length) {
            patterns[0].stops = stops;
        }

        res.send(patterns);
    } catch (err) {
        res.send(err).status(400);
    }
});

router.get('/stops', async (req, res) => {
    const { route } = req.query;

    try {
        const data = await getStops(route);

        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

router.get('/trains', async (req, res) => {
    const { route } = req.query;

    const data = await getTrains(route);

    res.send(data);
});

router.get('/predictions', async (req, res) => {
    const { route, stop } = req.query;

    try {
        let data = await getArrivals(stop, route);

        data = data.map((item) => {
            const predTime = convertTimestamp(item.arrT);
            const reqTime = convertTimestamp(item.prdt);
            const diff = Math.round((new Date(predTime) - new Date(reqTime)) / 60000);

            return {
                type: 'A',
                description: item.stpDe,
                name: item.stpNm,
                stopId: item.staId,
                id: item.rn,
                route: item.rt,
                direction: item.trDr,
                vehicleId: item.rn,
                destination: item.destNm,
                time: diff,
                timestamp: new Date(predTime).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }),
                delayed: item.isDly === 1 ? true : false,
                stopType: 'T',
            };
        });

        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

module.exports = router;
