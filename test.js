import test from 'ava';
import Machine from './index.js';

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

test('Can start machine', (t) => {
    let idleCalled = false;
    const machine = new Machine(states);

    machine.onState('IDLE', () => {
        idleCalled = true;
    });

    machine.start();

    t.is('IDLE', machine.state);
    t.is(idleCalled, true);
});

test('Can check if action is valid', (t) => {
    const machine = new Machine(states);

    t.is(machine.can('send'), true);
    t.is(machine.can('sent'), false);
});

test('Can dispatch', (t) => {
    let sendingCalled = false;
    let leftIdleStateCalled = false;
    let input = null;
    const machine = new Machine(states);

    machine.onState('SENDING', (v) => {
        sendingCalled = true;
        input = v;
    });

    machine.offState('IDLE', () => {
        leftIdleStateCalled = true;
    });

    t.is(machine.state, 'IDLE');

    machine.dispatch('send', 'foo');

    t.is(machine.state, 'SENDING');
    t.is(sendingCalled, true);
    t.is(leftIdleStateCalled, true);
    t.is(input, 'foo');
});

test('Can use machine storage', (t) => {
    const machine = new Machine(states);
    let storeChangeEventCalled = false;

    machine.on('data', () => {
        storeChangeEventCalled = true;
    });

    machine.setData({ foo: 'bar' });

    t.is(machine.data.foo, 'bar');
    t.is(storeChangeEventCalled, true);
});
