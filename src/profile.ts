import { ITermMap, IPrefixMap, IProfile, IDataFactory } from './rdf-interfaces';
import { PrefixMap } from './prefix-map';
import { TermMap } from './term-map';

class ProfileMap extends Map {};

export class Profile implements IProfile {
    readonly prefixes: IPrefixMap = new PrefixMap();
    readonly terms: ITermMap = new TermMap();
    readonly profileMap = new ProfileMap();
    constructor(public factory?: IDataFactory) {}
    set(term: string, value: any): IProfile {
        this.profileMap.set(term, value);
        return this;
    }
    get(term: string): any {
        return this.profileMap.get(term);
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
    setFactory(factory: IDataFactory): IProfile {
        this.factory = factory;
        return this;
    }
    importProfile (profile: IProfile, override: boolean = false): IProfile {
        if (!this.factory || override) {
            this.factory = profile['factory'];
        }
        this.prefixes.addAll(profile.prefixes, override);
        this.terms.addAll(profile.terms, override);
        return this;
    }
}
