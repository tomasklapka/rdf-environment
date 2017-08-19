import { IMap } from './rdf-interfaces';

// abstract class for TermMap, PrefixMap and other maps
export abstract class Map implements IMap {

    protected _default = null;
    protected _map: {} = {};

    get map(): {} { return this._map; }
    get default(): string { return this._default; }

    get(key: string): any {
        if (!this._map[key] && this._default) {
            return this._default
        }
        return this._map[key];
    }
    set(key: string, value: any): void {
        this._map[key] = value;
    }
    remove(key: string): void {
        delete this._map[key];
    }
    setDefault(value: any): void {
        this._default = value;
    }
    addAll(map: IMap, override: boolean = false): IMap {
        if (map['_default']) {
            if (!this._default || override) {
                this._default = map['_default'];
            }
        }
        for (const key in map.map) {
            if (!this._map[key] || override) {
                this._map[key] = map.map[key];
            }
        }
        return this;
    }
    resolve(key: string): any { throw new Error('resolve() not implemented'); }
    shrink(value: any): string { throw new Error('shrink() not implemented'); }
    clone(): IMap { throw new Error('clone() not implemented'); }
}
