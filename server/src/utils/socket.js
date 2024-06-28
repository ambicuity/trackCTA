'use strict';

const _ = require('lodash');
const { socketLogger: log } = require('../utils/logger');

const { getVehicles } = require('../tc-app/bus/bus-service');
const { getTrains } = require('../tc-app/train/train-service');

const TIMER = 3000; //ms
const keys = Object.keys;

const Events = {
    Connection: 'connection',
    RouteAdd: 'route-add',
    RouteRemove: 'route-remove',
    RouteRemoveAll: 'route-remove-all',
    Idle: 'idle',
    Active: 'active',
    Disconnect: 'disconnect',
    UpdateVehicles: 'update-vehicles',
    ServerError: 'server-error',
    Error: 'error',
};

const Types = {
    All: 'A',
    Bus: 'B',
    Train: 'T',
};

const TypeMapper = {
    B: 'bus',
    T: 'train',
};

const connectedSockets = {};

class SocketConnection {
    constructor(socket) {
        this.routes = {
            bus: {},
            train: {},
        };
        this.timer = null;
        this.socket = socket;
        this.idleTimer = null;
    }

    start_timer() {
        const that = this;

        this.timer = setInterval(async () => {
            try {
                const trainRouteStr = keys(that.routes.train).join(',');
                const busRouteStr = keys(that.routes.bus).join(',');
                let vehicles = [];

                if (busRouteStr) {
                    const busData = await that.get_busses(busRouteStr, null);
                    vehicles = [...vehicles, ...busData];
                }

                if (trainRouteStr) {
                    const trainData = await that.get_trains(trainRouteStr, null);
                    vehicles = [...vehicles, ...trainData];
                }

                that.socket.emit(Events.UpdateVehicles, vehicles);
            } catch (err) {
                console.log(err);
                that.socket.emit(Events.ServerError);
                log(Events.ServerError, JSON.stringify(err));
            }
        }, TIMER);
    }

    stop_timer() {
        clearInterval(this.timer);
        this.timer = null;
    }

    async add(routeObj) {
        try {
            let vehicles = [];

            switch (routeObj.type) {
                case Types.Bus:
                    const busData = await this.get_busses(routeObj.route, routeObj.color);

                    this.routes.bus[routeObj.route] = routeObj;

                    if (this.timer === null) {
                        this.start_timer();
                    }

                    vehicles = [...vehicles, ...busData];
                    break;

                case Types.Train:
                    const trainData = await this.get_trains(routeObj.route, routeObj.color);

                    this.routes.train[routeObj.route] = routeObj;

                    if (this.timer === null) {
                        this.start_timer();
                    }

                    vehicles = [...vehicles, ...trainData];
                    break;

                default:
                    throw Error(`Invalid type - ${routeObj.type}`);
            }

            this.socket.emit(Events.UpdateVehicles, vehicles);
        } catch (err) {
            console.log(err);
            this.socket.emit(Events.Error, err);
            log(Events.ServerError, JSON.stringify(err));
        }
    }

    remove(route, type) {
        if (this.routes[TypeMapper[type]][route]) {
            delete this.routes[TypeMapper[type]][route];
        }

        if (keys(this.routes.bus).length === 0 && keys(this.routes.train).length === 0) {
            this.stop_timer();
        }
    }

    remove_all({ type }) {
        switch (type) {
            case Types.All:
                this.routes = {
                    bus: {},
                    train: {},
                };
                break;
            case Types.Bus:
                this.routes = { ...this.routes, bus: {} };
                break;
            case Types.Train:
                this.routes = { ...this.routes, train: {} };
        }

        if (keys(this.routes.bus).length === 0 && keys(this.routes.train).length === 0) {
            this.stop_timer();
        }
    }

    async get_busses(routes, color) {
        let data = await getVehicles(routes);

        data = data.map((item) => ({
            id: item.vid,
            timestamp: item.tmstmp,
            position: {
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
            },
            route: item.rt,
            destination: item.des,
            delayed: item.dly,
            heading: parseInt(item.hdg, 10),
            color: color || this.routes.bus[item.rt].color,
            type: 'B',
        }));

        return data;
    }

    async get_trains(routes, color) {
        const data = await getTrains(routes);
        const trains = [];

        data.forEach((item) => {
            item.train.forEach((train) => {
                const newTrain = {
                    id: train.rn,
                    position: {
                        lat: parseFloat(train.lat),
                        lng: parseFloat(train.lon),
                        latitude: parseFloat(train.lat),
                        longitude: parseFloat(train.lon),
                    },
                    destination: train.destNm,
                    nextStop: train.nextStaNm,
                    nextStopId: train.nextStaId,
                    delayed: train.isDly === '0' ? false : true,
                    heading: parseInt(train.heading, 10),
                    color: color || this.routes.train[item['@name']].color,
                    route: item['@name'],
                    type: 'T',
                };

                trains.push(newTrain);
            });
        });

        return trains;
    }
}

const onRouteSelect = async (socket, route) => {
    log(Events.RouteAdd, JSON.stringify(route));

    connectedSockets[socket.id].add(route);
};

const onRouteDeselect = (socket, route) => {
    log(Events.RouteRemove, route.route);

    connectedSockets[socket.id].remove(route.route, route.type);
};

const onDisconnect = (socket) => {
    log(Events.Disconnect, socket.id);

    connectedSockets[socket.id].stop_timer();
    delete connectedSockets[socket.id];
};

const onRemoveAll = (socket, type) => {
    log(Events.RouteRemoveAll, `${type.type} - ${socket.id}`);

    connectedSockets[socket.id].remove_all(type);
};

const onIdle = (socket) => {
    log(Events.Idle, socket.id);

    connectedSockets[socket.id].stop_timer();
};

const onActive = (socket) => {
    log(Events.Active, socket.id);

    const connection = connectedSockets[socket.id];

    if (connection && (keys(connection.routes.bus).length || keys(connection.routes.train).length)) {
        connectedSockets[socket.id].start_timer();
    }
};

const onConnection = (socket) => {
    log(Events.Connection, socket.id);

    connectedSockets[socket.id] = new SocketConnection(socket);

    socket.on(Events.RouteAdd, _.partial(onRouteSelect, socket));
    socket.on(Events.RouteRemove, _.partial(onRouteDeselect, socket));
    socket.on(Events.RouteRemoveAll, _.partial(onRemoveAll, socket));
    socket.on(Events.Idle, _.partial(onIdle, socket));
    socket.on(Events.Active, _.partial(onActive, socket));
    socket.on(Events.Disconnect, _.partial(onDisconnect, socket));
};

module.exports = {
    onConnection,
};
