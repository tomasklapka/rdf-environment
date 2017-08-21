import { getDebug, getFnDebug } from './debug';
const debug = getDebug('rdf-environment');

import {
    ITerm, INamedNode, IBlankNode, ILiteral, IVariable,
    IDefaultGraph, IQuad, ITriple, IDataFactory,
    IEvent, IStream, ISource, ISink, IStore,
    IDatasetStatic, IDataset,
    IMap, ITermMap, IPrefixMap, IProfile,
    IGraph, IRDFEnvironment
} from './interfaces';
import { Map } from './map';
import { TermMap } from './term-map';
import { PrefixMap } from './prefix-map';
import { Profile } from './profile';

export class RDFEnvironment extends Profile implements IRDFEnvironment {

    private _libName = 'none';
    private _lib = null;
    private _factory = null;

    // types
    Map: Map;
    TermMap: TermMap;
    PrefixMap: PrefixMap;
    Profile: Profile;
    RDFEnvironment: RDFEnvironment;
    interfaces = require('./interfaces');

    // getters
    get using(): string { return this._libName; }
    get lib() { return this._lib; }
    get factory() { return this._factory; }

    // use() to hook rdf library/DataFactory or plugin
    use(plugin: object|Function|IDataFactory): RDFEnvironment {
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
        } else {
            // else check for rdf-ext
            if (plugin['defaults'] && plugin['defaults']['Dataset'] && plugin['waitFor']) {
                this._libName = 'rdf-ext';
                this._lib = plugin;
            } else {
                // else try to load as the actual plugin
                this.plugin(plugin);
            }
        }
        return this;
    }
    /*
     * Basic plugin mechanism for adding new types into RDFEnvironment library and adding new methods to all types
     * plugin object structure:
     *  'RDFEnvironmentPlugin': {
     *      'types': {
     *          'NewType1': NewType1,
     *          'NewType2': NewType2
     *      },
     *      'extend': { // adding prototype methods into existing types. Use extendClass for adding class methods
     *          'RDFEnvironment': {
     *              createNewType1: (value) -> {
     *                  return new NewType1(value);
     *              }
     *              createNewType2: (value) -> {
     *                  return new NewType2(value);
     *              }
     *          }
     *      }
     * }
     * override = true will overwrite existing types or methods
     */
    plugin(plugin: object, override: boolean = false): RDFEnvironment {
        // not a plugin if missing meta property
        plugin = plugin['plugin'] || plugin;
        const meta = plugin['RDFEnvironmentPlugin'];
        if (!meta) {
            return this;
        }
        // add new types
        if (meta.types) {
            for (const _type in meta.types) {
                if (!this[_type] || override) {
                    this[_type] = meta.types[_type];
                }
            }
        }
        // extend prototype methods
        if (meta.extend) {
            for (const _extendedClass in meta.extend) {
                const newProps = meta.extend[_extendedClass];
                const extendee = this[_extendedClass];
                for (const prop in newProps) {
                    if (!extendee.prototype[prop] || override) {
                        extendee.prototype[prop] = newProps.prototype[prop];
                    }
                }
            }
        }
        // extend class methods
        if (meta.extendClass) {
            for (const _extendedClass in meta.extendClass) {
                const newProps = meta.extendClass[_extendedClass];
                const extendee = this[_extendedClass];
                for (const prop in newProps) {
                    if (!extendee[prop] || override) {
                        extendee[prop] = newProps[prop];
                    }
                }
            }
        }
        return this;
    }
    // IRDFEnvironment
    createBlankNode(): INamedNode {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.blankNode();
    }
    createNamedNode(iri: string): INamedNode {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.namedNode(iri);
    }
    createLiteral(value: string, language?: string, datatype?: INamedNode): ILiteral {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        let languageOrDatatype: string|INamedNode = language;
        if (!languageOrDatatype) {
            languageOrDatatype = datatype;
        }
        return this._factory.literal(value, languageOrDatatype);
    }
    createTriple(subject: ITerm, predicate: ITerm, object: ITerm): IQuad {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.quad(subject, predicate, object);
    }
    createQuad(subject: ITerm, predicate: ITerm, object: ITerm, graph?: ITerm): IQuad {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.quad(subject, predicate, object, graph);
    }
    createProfile(empty: boolean = false): IProfile {
        const profile = new Profile();
        if (!empty) {
            profile.importProfile(this);
        }
        return profile;
    }
    createTermMap(empty: boolean = false): ITermMap {
        const termMap = new TermMap();
        if (!empty) {
            termMap.addAll(this.terms);
        }
        return termMap;
    }
    createPrefixMap(empty: boolean = false): IPrefixMap {
        const prefixMap = new PrefixMap();
        if (!empty) {
            prefixMap.addAll(this.prefixes);
        }
        return prefixMap;
    }
    createGraph(quads?: IQuad[]): IGraph {
        throw new Error('createGraph() not implemented');
    }
    createAction(test: any, action: any): any {
        throw new Error('createAction() not implemented');
    }
    // IDataFactory
    blankNode(): IBlankNode {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.blankNode();
    }
    namedNode(value?: string): INamedNode {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.namedNode(value);
    }
    literal(value: string, languageOrDatatype: string|INamedNode): ILiteral {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.literal(value, languageOrDatatype);
    }
    variable(value: string): IVariable {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.variable(value);
    }
    defaultGraph(): IDefaultGraph {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.defaultGraph();
    }
    triple(subject: ITerm, predicate: ITerm, object: ITerm): IQuad {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.quad(subject, predicate, object, this.factory.defaultGraph());
    }
    quad(subject: ITerm, predicate: ITerm, object: ITerm, graph: ITerm): IQuad {
        if (!this._factory) { throw new Error('No factory used. Call use(factory: IDataFactory)'); }
        return this._factory.quad(subject, predicate, object, graph);
    }
    // additional DataFactory like methods for maps and Profile
    prefixMap(empty: boolean = false): IPrefixMap { return this.createPrefixMap(empty); }
    termMap(empty: boolean = false): ITermMap { return this.createTermMap(empty); }
    profile(empty: boolean = false): IProfile { return this.createProfile(empty); }
}
