import Store from './Store.js';

export default class Machine extends Store {
    constructor(states, initialState = 'IDLE', store = {}) {
        super(store);

        this.states = states;
        this.initialState = initialState;
        this.state = initialState;
    }

    can(action) {
        const state = this.states[this.state];

        return action in state.on;
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
        super.reset();
        this.state = this.initialState;

        this.start(input);
    }

    onState(state, cb) {
        this.on(state, cb);
    }

    offState(state, cb) {
        this.on(`${state}-OFF`, cb);
    }
}
