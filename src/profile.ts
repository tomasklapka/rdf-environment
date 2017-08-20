import { IMap, ITermMap, IPrefixMap, IProfile, IDataFactory } from './rdf-interfaces';
import { PrefixMap } from './prefix-map';
import { TermMap } from './term-map';
import { Map } from './map';

class ProfileMap extends Map {};

export class Profile implements IProfile {
    readonly prefixes: IPrefixMap = new PrefixMap();
    readonly terms: ITermMap = new TermMap();
    readonly _map = new ProfileMap();
    constructor(public factory?: IDataFactory) {}
    set(term: string, value: any): IProfile {
        this._map.set(term, value);
        return this;
    }
    get(term: string): any {
        return this._map.get(term);
    }
    get map(): ProfileMap { return this._map; }
    resolve(toresolve: string): string {
        if (toresolve.indexOf(':') !== -1) {
            return this.prefixes.resolve(toresolve);
        }
        return this.terms.resolve(toresolve);
    }
    setDefaultVocabulary(iri: string): IProfile {
        this.terms.setDefault(iri);
        return this;
    }
    setDefaultPrefix(iri: string): IProfile {
        this.prefixes.setDefault(iri);
        return this;
    }
    setTerm(term: string, iri: string): IProfile {
        this.terms.set(term, iri);
        return this;
    }
    setPrefix(prefix: string, iri: string): IProfile {
        this.prefixes.set(prefix, iri);
        return this;
    }
    setFactory(factory: IDataFactory): IProfile {
        this.factory = factory;
        return this;
    }
    importProfile (profile: Profile, override: boolean = false): IProfile {
        if (!this.factory || override) {
            this.factory = profile['factory'];
        }
        const map = profile.map;
        if (map) {
            const m = map.map;
            for (const key in m) {
                if (!this.get(key) || override) {
                    this.set(key, m[key]);
                }
            }
        }
        this.prefixes.addAll(profile.prefixes, override);
        this.terms.addAll(profile.terms, override);
        return this;
    }
}
