"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profile_1 = require("./profile");
const prefix_map_1 = require("./prefix-map");
const term_map_1 = require("./term-map");
class RDFEnvironment extends profile_1.Profile {
    createBlankNode() {
        return this.factory.blankNode();
    }
    createNamedNode(iri) {
        return this.factory.namedNode(iri);
    }
    createLiteral(value, language, datatype) {
        let languageOrDatatype = language;
        if (!languageOrDatatype) {
            languageOrDatatype = datatype;
        }
        return this.factory.literal(value, languageOrDatatype);
    }
    createTriple(subject, predicate, object) {
        return this.factory.quad(subject, predicate, object);
    }
    createQuad(subject, predicate, object, graph) {
        return this.factory.quad(subject, predicate, object, graph);
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
}
exports.RDFEnvironment = RDFEnvironment;
