import Events from '@bleckert/events';

export class Machine extends Events {
    constructor(states, initial = 'IDLE', data = {}) {
        super();

        this.states = states;
        this.initial = initial;
        this.state = initial;
        this._defaultData = { ...data };
        this.set(this._defaultData);
    }

    can(action) {
        return action in this.states[this.state].on;
    }

    isFinal() {
        return this.states[this.state].final;
    }

    transition(prevState, input) {
        if (prevState) {
            this.emit(`${prevState}-OFF`);
        }

        this.emit(this.state, input);
        this.emit('transition', this.state, prevState, input);
    }

    dispatch(actionName, input = null) {
        if (!this.can(actionName)) {
            return;
        }

        const currentState = this.state;
        this.state = this.states[this.state].on[actionName];

        this.transition(currentState, input);
    }

    start(input = null) {
        this.transition(null, input);
    }

    reset(input = null) {
        this.set({ ...this._defaultData });
        this.state = this.initial;

        this.start(input);
    }

    offState(state, cb) {
        this.on(`${state}-OFF`, cb);
    }

    set(data) {
        this.data = data;

        Object.freeze(this.data);
    }

    setData(data) {
        this.set({ ...this.data, ...data });
        this.emit('data', data);
    }
}

const store = {};

export function createMachine(id, states, initial, data = {}) {
    if (!store[id]) {
        store[id] = new Machine(states, initial, data);
    }

    return store[id];
}
