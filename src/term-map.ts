import { Map, IMap, ITermMap } from '.';

export class TermMap extends Map implements ITermMap {
    get(key: string): any {
        if (!this._map[key] && this._default) {
            return this.default+key
        }
        return this._map[key];
    }
    set(key: string, value: any): void {
        if (/[\s:]/.test(key)) throw new Error('TermMap\'s term cannot contain white space or colon.');
        this._map[key] = value;
    }
    resolve(key: string): string {
        return this.get(key);
    }
    shrink(value: string): string {
        for (const key in this._map) {
            if (this._map[key] == value) {
                return key;
            }
        }
        return null;
    }
    clone(): IMap {
        return (new TermMap()).addAll(this);
    }
}
