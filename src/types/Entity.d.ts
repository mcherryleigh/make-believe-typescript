export type EntityPlugin = {
    name: string,
    fn: ()=>any
}

export interface EntityOptions {
    verbose?: boolean;
    plugins?: Array<Plugin>;
    schema: object;
    variants: object;
    prng?: (prng: any) => object;
}
