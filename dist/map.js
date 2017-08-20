"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// abstract class for TermMap, PrefixMap and other maps
class Map {
    constructor() {
        this._default = null;
        this._map = {};
    }
    get map() { return this._map; }
    get default() { return this._default; }
    get(key) {
        if (!this._map[key] && this._default) {
            return this._default;
        }
        return this._map[key];
    }
    set(key, value) {
        this._map[key] = value;
    }
    remove(key) {
        delete this._map[key];
    }
    setDefault(value) {
        this._default = value;
    }
    addAll(map, override = false) {
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
    resolve(key) { throw new Error('resolve() not implemented'); }
    shrink(value) { throw new Error('shrink() not implemented'); }
    clone() { throw new Error('clone() not implemented'); }
}
exports.Map = Map;
