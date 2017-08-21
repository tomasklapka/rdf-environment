/// <reference types="typescript" />

export as namespace rdfEnvironmentLib;
export {
    ITerm, INamedNode, IBlankNode, ILiteral, IVariable,
    IDefaultGraph, IQuad, ITriple, IDataFactory,
    IEvent, IStream, ISource, ISink, IStore,
    IDatasetStatic, IDataset,
    IMap, ITermMap, IPrefixMap, IProfile,
    IGraph, IRDFEnvironment
} from '.';
export { Map, TermMap, PrefixMap, Profile, RDFEnvironment } from '.';
