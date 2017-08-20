"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prefix_map_1 = require("./prefix-map");
const term_map_1 = require("./term-map");
const map_1 = require("./map");
class ProfileMap extends map_1.Map {
}
;
class Profile {
    constructor(factory) {
        this.factory = factory;
        this.prefixes = new prefix_map_1.PrefixMap();
        this.terms = new term_map_1.TermMap();
        this._map = new ProfileMap();
    }
    set(term, value) {
        this._map.set(term, value);
        return this;
    }
    get(term) {
        return this._map.get(term);
    }
    get map() { return this._map; }
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
    setFactory(factory) {
        this.factory = factory;
        return this;
    }
    importProfile(profile, override = false) {
        if (!this.factory || override) {
            this.factory = profile['factory'];
        }
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
