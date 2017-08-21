"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("./debug");
const debug = debug_1.getDebug('rdf-environment');
const term_map_1 = require("./term-map");
const prefix_map_1 = require("./prefix-map");
const profile_1 = require("./profile");
class RDFEnvironment extends profile_1.Profile {
    constructor() {
        super(...arguments);
        this._libName = 'none';
        this._lib = null;
        this._factory = null;
    }
    // getters
    get using() { return this._libName; }
    get lib() { return this._lib; }
    get factory() { return this._factory; }
    // use() to hook rdf library/DataFactory or plugin
    use(plugin) {
        if (!plugin) {
            this._libName = 'none';
            if (this._lib === this._factory) {
                this._factory = null;
            }
            this._lib = null;
            return;
        }
        // check for IDataFactory
        if (plugin['namedNode'] && plugin['blankNode'] && plugin['literal'] &&
            plugin['variable'] && plugin['defaultGraph'] && plugin['quad']) {
            this._factory = plugin;
        }
        // check for rdflib
        if (plugin['IndexedFormula'] && plugin['lit']) {
            this._libName = 'rdflib';
            this._lib = plugin;
        }
        else {
            // else check for rdf-ext
            if (plugin['defaults'] && plugin['defaults']['Dataset'] && plugin['waitFor']) {
                this._libName = 'rdf-ext';
                this._lib = plugin;
            }
        }
        return this;
    }
    // IRDFEnvironment
    createBlankNode() {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.blankNode();
    }
    createNamedNode(iri) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.namedNode(iri);
    }
    createLiteral(value, language, datatype) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        let languageOrDatatype = language;
        if (!languageOrDatatype) {
            languageOrDatatype = datatype;
        }
        return this._factory.literal(value, languageOrDatatype);
    }
    createTriple(subject, predicate, object) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.quad(subject, predicate, object);
    }
    createQuad(subject, predicate, object, graph) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.quad(subject, predicate, object, graph);
    }
    createProfile(empty = false) {
        const profile = new profile_1.Profile();
        if (!empty) {
            profile.importProfile(this);
        }
        return profile;
    }
    createTermMap(empty = false) {
        const termMap = new term_map_1.TermMap();
        if (!empty) {
            termMap.addAll(this.terms);
        }
        return termMap;
    }
    createPrefixMap(empty = false) {
        const prefixMap = new prefix_map_1.PrefixMap();
        if (!empty) {
            prefixMap.addAll(this.prefixes);
        }
        return prefixMap;
    }
    createGraph(quads) {
        throw new Error('createGraph() not implemented');
    }
    createAction(test, action) {
        throw new Error('createAction() not implemented');
    }
    // IDataFactory
    blankNode() {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.blankNode();
    }
    namedNode(value) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.namedNode(value);
    }
    literal(value, languageOrDatatype) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.literal(value, languageOrDatatype);
    }
    variable(value) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.variable(value);
    }
    defaultGraph() {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.defaultGraph();
    }
    triple(subject, predicate, object) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.quad(subject, predicate, object, this.factory.defaultGraph());
    }
    quad(subject, predicate, object, graph) {
        if (!this._factory) {
            throw new Error('No factory used. Call use(factory: IDataFactory)');
        }
        return this._factory.quad(subject, predicate, object, graph);
    }
    // additional DataFactory like methods for maps and Profile
    prefixMap(empty = false) { return this.createPrefixMap(empty); }
    termMap(empty = false) { return this.createTermMap(empty); }
    profile(empty = false) { return this.createProfile(empty); }
}
exports.RDFEnvironment = RDFEnvironment;
