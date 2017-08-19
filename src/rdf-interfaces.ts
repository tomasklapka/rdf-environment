import { EventEmitter } from 'events';

/*
 * Low level RDFJS spec interfaces
 * https://github.com/rdfjs/representation-task-force/blob/master/interface-spec.md 
 */
export interface ITerm {
    termType: string;
    value: string;
    equals(other: ITerm): boolean;
}
export interface INamedNode extends ITerm {}
export interface IBlankNode extends ITerm {}
export interface ILiteral extends ITerm {
    language: string;
    datatype: INamedNode;
}
export interface IVariable extends ITerm {}
export interface IDefaultGraph extends ITerm {}
export interface IQuad {
    subject: ITerm;
    predicate: ITerm;
    object: ITerm;
    graph: ITerm;
    equals(other: IQuad): boolean;
}
export interface ITriple extends IQuad {};
export interface IDataFactory {
    namedNode(value: string): INamedNode;
    blankNode(value?: string): IBlankNode;
    literal(value: string, languageOrDatatype?: string|INamedNode): ILiteral;
    variable(value: string): IVariable;
    defaultGraph(): IDefaultGraph;
    triple(subject: ITerm, predicate: ITerm, object: ITerm): IQuad;
    quad(subject: ITerm, predicate: ITerm, object: ITerm, graph?: ITerm): IQuad;
}
export interface IEvent {}
export interface IStream extends EventEmitter {
    readable: IEvent;
    end: IEvent;
    error: IEvent;
    data: IEvent;
    prefix: IEvent;
    read(): IQuad;
}
export interface ISource {
    match(subject?: ITerm|RegExp, predicate?: ITerm|RegExp, object?: ITerm|RegExp, graph?: ITerm|RegExp): IStream;
}
export interface ISink {
    import(stream: IStream): EventEmitter;
}
export interface IStore extends ISource, ISink {
    remove(stream: IStream): EventEmitter;
    removeMatches(subject?: ITerm|RegExp, predicate?: ITerm|RegExp, object?: ITerm|RegExp, graph?: ITerm|RegExp): EventEmitter;
    deleteGraph(graph: ITerm|string): EventEmitter;
}
/*
 * Dataset Spec
 */
export interface IDatasetStatic {
    new (): IDataset;
    import(factory: ()=>IDataset, stream: IStream): Promise<IDataset>;
}
export interface IDataset {
    readonly length: number;
    // Array/Iterable compat
    every(callback: ()=>any): boolean;
    filter(callback: ()=>any): IDataset;
    forEach(callback: ()=>void): void;
    includes(quad: IQuad): boolean;
    map(callback: ()=>any): IDataset;
    some(callback: ()=>any): boolean;
    // Set compat
    add(quad: IQuad): IDataset;
    addAll(quadsOrDataset: IQuad[]|IDataset): IDataset;
    difference(other: IDataset);
    intersection(other: IDataset): IDataset;
    merge(quadsOrDataset: IQuad[]|IDataset): IDataset;
    // misc RDF
    clone(): IDataset;
    equals(other: IDataset): boolean;
    import(stream: IStream): Promise<IDataset>;
    match(subject: ITerm, predicate: ITerm, object: ITerm, graph: ITerm): IDataset;
    remove(quad: IQuad): IDataset;
    removeMatches(subject: ITerm, predicate: ITerm, object: ITerm, graph: ITerm): IDataset;
    toArray(): IQuad[];
    toCanonical(): string;
    toStream(): IStream;
    toString(): string;
}
/*
 * Maps, Profile and RDFEnvironment
 * as defined by https://www.w3.org/TR/rdf-interfaces/#rdf-environment-interfaces
 */
export interface IMap {
    readonly map: {};
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    resolve(key: string): any;
    shrink(value: any): string;
    setDefault(value: any): void;
    addAll(map: IMap, override?: boolean): IMap;
}
export interface ITermMap extends IMap {}
export interface IPrefixMap extends IMap {}
export interface IProfile {
    readonly prefixes: IPrefixMap;
    readonly terms: ITermMap;
    resolve(toresolve: string): string;
    setDefaultVocabulary (iri: string): void;
    setDefaultPrefix (iri: string): void;
    setTerm (term: string, iri: string): void;
    setPrefix (prefix: string, iri: string): void;
    importProfile (profile: IProfile, override?: boolean): IProfile;
}
export interface IGraph extends IDataset {} // this needs to be changed 
export interface IRDFEnvironment extends IProfile {
    createBlankNode(): INamedNode;
    createNamedNode(value: string): INamedNode;
    createLiteral(value: string, language?: string, datatype?: INamedNode): ILiteral;
    createTriple(subject: ITerm, predicate: ITerm, object: ITerm): ITriple;
    createProfile(empty?: boolean): IProfile;
    createTermMap(empty?: boolean): ITermMap;
    createPrefixMap(empty?: boolean): IPrefixMap;
    createGraph(triples?: IQuad[]): IGraph;
    createAction(test: any, action: any): any; // Triple types not implemented yet?
}