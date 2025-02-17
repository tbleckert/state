import Events from '@bleckert/events';

export interface State {
    on?: { [key: string]: string };
    final?: boolean;
}

export interface MachineConfig {
    id: string;
    states: { [key: string]: State };
    initial: string;
    data?: { [key: string]: any };
    actions?: { [key: string]: (machine: Machine, input: any) => void };
}

export class Machine extends Events {
    states: { [key: string]: State };
    initial: string;
    state: string;
    actions: { [key: string]: (machine: Machine, input: any) => void };
    data: { [key: string]: any };
    private _defaultData: { [key: string]: any };

    constructor(states: { [key: string]: State }, initial?: string, data?: { [key: string]: any }, actions?: { [key: string]: (machine: Machine, input: any) => void });

    can(action: string): boolean;
    isFinal(): boolean;
    transition(prevState: string | null, input: any): void;
    dispatch(actionName: string, input?: any): void;
    start(input?: any): void;
    reset(input?: any): void;
    offState(state: string, cb: () => void): void;
    set(data: { [key: string]: any }): void;
    setData(data: { [key: string]: any }): void;
}

export function createMachine(config: MachineConfig): Machine;
