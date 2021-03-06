import { Map, IMap, IPrefixMap, IStream } from '.';

// This class is copied (and modified) from bergos'es https://github.com/rdf-ext/rdf-ext/blob/master/lib/PrefixMap.js
export class PrefixMap extends Map implements IPrefixMap {
    set(key: string, value: any): void {
        if (/[\s]/.test(key)) throw new Error('PrefixMap\'s term cannot contain white space.');
        this._map[key] = value;
    }
    resolve(key: string): string {
        if (key.indexOf('://') !== -1) { return null; }
        const separatorOffset = key.indexOf(':');
        if (separatorOffset === -1) { return null; }
        const prefix = key.substr(0, separatorOffset).toLowerCase();
        if (prefix === '' && this._default) {
            return this._default + key.substr(1);
        }
        if (!(prefix in this._map)) { return null; }
        return this._map[prefix] + key.substr(separatorOffset + 1);
    }
    shrink(value: string): string {
        value = value['value'] || value;
        for (const key in this._map) {
            const namespace = this._map[key];
            if (value.substr(0, namespace.length) === namespace) {
                return key + ':' + value.substr(namespace.length);
            }
        }
        if (value.substr(0, this._default.length) === this._default) {
            return ':' + value.substr(this._default.length);
        }
        return value;
    }
    clone(): IMap {
        return (new PrefixMap()).addAll(this);
    }
    import(stream: IStream): Promise<IPrefixMap> {
        stream.on('prefix', (key, value) => {
            this._map[key] = value;
        });
        return (new Promise((resolve, reject) => {
            stream.on('end', resolve)
            stream.on('error', reject)
        })).then(() => {
            return this;
        })
    }
    export(stream: IStream): IPrefixMap {
        for (const key in this._map) {
            stream.emit('prefix', key, this._map[key]);
        }
        return this;
    }
}
