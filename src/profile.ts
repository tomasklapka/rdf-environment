import { IMap, ITermMap, IPrefixMap, IProfile } from '.';
import { Map, TermMap, PrefixMap } from '.';

class ProfileMap extends Map implements IMap {};

export class Profile implements IProfile {
    readonly prefixes: IPrefixMap = new PrefixMap();
    readonly terms: ITermMap = new TermMap();
    readonly _map = new ProfileMap();
    get map(): ProfileMap { return this._map; }
    set(term: string, value: any): IProfile {
        this._map.set(term, value);
        return this;
    }
    get(term: string): any {
        return this._map.get(term);
    }
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
    importProfile (profile: IProfile, override: boolean = false): IProfile {
        const map: ProfileMap = profile['map'];
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
