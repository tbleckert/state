<h1 align="center">State</h1>
<p align="center">Simple state machine</p>

## Usage

```javascript
import Machine from '@bleckert/state';

const machine = new Machine({
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
});

machine.onState('SENDING', console.log);
machine.dispatch('send');
```
