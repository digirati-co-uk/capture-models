export type MapValues<T, Base = {}> = T extends { [K in keyof T]: infer U } ? Base & U : never;

