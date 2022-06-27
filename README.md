<h1 align="center">
  Simple state machine
</h1>

<h6 align="center">
  <a href="https://github.com/tbleckert/state#install">Install</a>
  ·
  <a href="https://github.com/tbleckert/state#usage">Usage</a>
</h6>

<p align="center">
    <a href="https://www.npmjs.com/package/@bleckert/state">
        <img src="https://img.shields.io/npm/v/@bleckert/state?style=for-the-badge" alt="NPM" />
    </a>
    <a href="https://bundlephobia.com/result?p=@bleckert/state">
        <img src="https://img.shields.io/bundlephobia/minzip/@bleckert/state?style=for-the-badge" />
    </a>
    <a href="https://github.com/sponsors/tbleckert">
        <img src="https://img.shields.io/badge/GitHub-donate-yellow?style=for-the-badge" />
    </a>
</p>

## Install

`npm i @bleckert/state` or `yarn add @bleckert/state`

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
