'use strict';

class Logger {
    constructor(msg) {
        this.msg = msg;
    }

    begin() {
        console.log(`>>> BEGIN ${this.msg}`);
    }

    success() {
        // console.log(`>>> SUCCESS ${this.msg}`);
    }

    fail() {
        // console.log(`>>> FAIL ${this.msg}`);
    }
}

module.exports = Logger;
