import Events from '@bleckert/events';

export default class Store extends Events {
    constructor(data = {}) {
        super();

        this._defaultData = { ...data };
        this.reset();
    }

    set(data) {
        this.data = data;

        Object.freeze(this.data);
    }

    setData(data) {
        this.set({ ...this.data, ...data });
        this.emit('data', data);
    }

    reset() {
        this.set({ ...this._defaultData });
    }
}
