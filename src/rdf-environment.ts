import {
    ITerm, INamedNode, ILiteral, IQuad,
    IProfile, IPrefixMap, ITermMap,
    IRDFEnvironment, IGraph
} from './rdf-interfaces';
import { Profile } from './profile';
import { PrefixMap } from './prefix-map';
import { TermMap } from './term-map';

export class RDFEnvironment extends Profile implements IRDFEnvironment {

    createBlankNode(): INamedNode {
        return this.factory.blankNode();
    }
    createNamedNode(iri: string): INamedNode {
        return this.factory.namedNode(iri);
    }
    createLiteral(value: string, language?: string, datatype?: INamedNode): ILiteral {
        let languageOrDatatype: string|INamedNode = language;
        if (!languageOrDatatype) {
            languageOrDatatype = datatype;
        }
        return this.factory.literal(value, languageOrDatatype);
    }
    createTriple(subject: ITerm, predicate: ITerm, object: ITerm): IQuad {
        return this.factory.quad(subject, predicate, object);
    }
    createQuad(subject: ITerm, predicate: ITerm, object: ITerm, graph?: ITerm): IQuad {
        return this.factory.quad(subject, predicate, object, graph);
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
}

