"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class TermMap extends _1.Map {
    get(key) {
        if (!this._map[key] && this._default) {
            return this.default + key;
        }
        return this._map[key];
    }
    set(key, value) {
        if (/[\s:]/.test(key))
            throw new Error('TermMap\'s term cannot contain white space or colon.');
        this._map[key] = value;
    }
    resolve(key) {
        return this.get(key);
    }
    shrink(value) {
        for (const key in this._map) {
            if (this._map[key] == value) {
                return key;
            }
        }
        return null;
    }
    clone() {
        return (new TermMap()).addAll(this);
    }
}
exports.TermMap = TermMap;
