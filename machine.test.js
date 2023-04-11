import { expect, test } from 'vitest';
import { Machine, createMachine } from './index.js';

const states = {
    IDLE: {
        on: {
            send: 'SENDING',
        },
    },
    SENDING: {
        on: {
            sent: 'SENT',
            failed: 'ERROR',
        },
    },
    SENT: {
        final: true,
    },
    FAILED: {
        on: {
            retry: 'SENDING',
        },
    },
};

test('Can create a machine', () => {
    const machine = new Machine(states, 'IDLE');

    expect(machine.state).toBe('IDLE');
});

test('Can transition to a new state', () => {
    const machine = new Machine(states, 'IDLE');

    machine.dispatch('send');

    expect(machine.state).toBe('SENDING');
});

test('Can only transition to a valid state', () => {
    const machine = new Machine(states, 'IDLE');

    machine.dispatch('sent');

    expect(machine.state).toBe('IDLE');
});

test('Can transition to a final state', () => {
    const machine = new Machine(states, 'IDLE');

    machine.dispatch('send');
    machine.dispatch('sent');

    expect(machine.state).toBe('SENT');
    expect(machine.isFinal()).toBe(true);
});

test('Can listen to state changes', () => {
    let called = false;
    const machine = new Machine(states, 'IDLE');

    machine.on('IDLE', () => {
        called = true;
    });

    machine.start();

    expect(called).toBe(true);
});

test('Can listen to leaving state', () => {
    let called = false;
    const machine = new Machine(states, 'IDLE');

    machine.offState('IDLE', () => {
        called = true;
    });

    machine.dispatch('send');
    expect(called).toBe(true);
});

test('Can listen to state changes and unlisten', () => {
    let called = false;
    const machine = new Machine(states, 'IDLE');
    const onSend = () => {
        called = true;
    };

    machine.on('SENDING', onSend);
    machine.off('SENDING', onSend);
    machine.dispatch('send');

    expect(called).toBe(false);
});

test('Can reset machine', () => {
    const machine = new Machine(states, 'IDLE');

    machine.dispatch('send');
    expect(machine.state).toBe('SENDING');

    machine.reset();
    expect(machine.state).toBe('IDLE');
});

test('Can use machine storage', () => {
    const machine = new Machine(states, 'IDLE');

    machine.setData({
        foo: 'bar',
    });

    expect(machine.data.foo).toBe('bar');
});

test('Can reset machine storage', () => {
    const machine = new Machine(states, 'IDLE');

    machine.setData({
        foo: 'bar',
    });

    expect(machine.data.foo).toBe('bar');

    machine.reset();

    expect(machine.data.foo).toBe(undefined);
});

test('Can create multiple machines with same structure', () => {
    const machine1 = createMachine({
        id: 'machine1',
        states,
        initial: 'IDLE',
    });
    const machine2 = createMachine({
        id: 'machine2',
        states,
        initial: 'IDLE',
    });

    expect(machine1.state).toBe('IDLE');
    expect(machine2.state).toBe('IDLE');

    machine1.dispatch('send');

    expect(machine1.state).toBe('SENDING');
    expect(machine2.state).toBe('IDLE');
});

test('Can use machine actions', () => {
    let called = false;
    const machine = new Machine(states, 'IDLE', {}, {
        SENDING: () => {
            called = true;
        },
    });

    machine.dispatch('send');

    expect(called).toBe(true);
});
