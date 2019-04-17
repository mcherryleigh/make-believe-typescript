export interface ClassDef {
    _double: () => number;
    _gen: () => number;
    random: (opts?: RandomMethodOptions) => number;
    randomInteger: (opts?: RandomMethodOptions) => number;
    pick: (pickArray?: any, amount?: number) => any[];
    pickUnique: (pickArray: any[], amount: number) => any[]
    pickSeries: (pickArray: any[], amount: number) => any[];
    shuffle: (arr: any[]) => any[];
    times: (amount: number, fn: (...params: any[]) => any|any[]) => any[];
    addPlugin: (plugin: PluginObject) => void;
}

export type Options = {
    seed: any;
    state?: number;
}

export type RandomMethodOptions = {
    min?: number;
    max?: number;
}

export type PluginObject = {
    fn: (...params: any[]) => any | any[];
    name: string;
}
