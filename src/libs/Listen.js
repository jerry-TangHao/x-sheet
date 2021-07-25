class Listen {

    constructor() {
        this.pool = {};
    }

    clear() {
        Object.keys((key) => {
            delete this.pool[key];
        })
    }

    removeListen(key) {
        delete this.pool[key];
    }

    registerListen(key, call) {
        this.pool[key] = call;
    }

    execute(key, message) {
        if (this.pool[key]) {
            this.pool[key](message);
        }
    }

}

export {
    Listen
}