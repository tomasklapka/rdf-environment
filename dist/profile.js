"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ProfileMap extends _1.Map {
}
;
class Profile {
    constructor() {
        this.prefixes = new _1.PrefixMap();
        this.terms = new _1.TermMap();
        this._map = new ProfileMap();
    }
    get map() { return this._map; }
    set(term, value) {
        this._map.set(term, value);
        return this;
    }
    get(term) {
        return this._map.get(term);
    }
    resolve(toresolve) {
        if (toresolve.indexOf(':') !== -1) {
            return this.prefixes.resolve(toresolve);
        }
        return this.terms.resolve(toresolve);
    }
    setDefaultVocabulary(iri) {
        this.terms.setDefault(iri);
        return this;
    }
    setDefaultPrefix(iri) {
        this.prefixes.setDefault(iri);
        return this;
    }
    setTerm(term, iri) {
        this.terms.set(term, iri);
        return this;
    }
    setPrefix(prefix, iri) {
        this.prefixes.set(prefix, iri);
        return this;
    }
    importProfile(profile, override = false) {
        const map = profile['map'];
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
exports.Profile = Profile;
