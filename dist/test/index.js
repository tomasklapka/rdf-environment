"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const events_1 = require("events");
const rdf_environment = require("..");
const libs = {
    'none': undefined,
    'rdflib': require('rdflib'),
    'rdf-ext': require('rdf-ext')
};
for (const lib in libs) {
    libs[lib] = rdf_environment(libs[lib]);
}
describe('Library rdf-environment', () => {
    for (const lib in libs) {
        describe('Mixed into ' + lib, () => {
            const rdf = libs[lib];
            let defaults = rdf;
            if (lib === 'rdf-ext') {
                defaults = rdf.defaults;
            }
            it('should have added functions', () => {
                chai_1.expect(typeof rdf.environment).to.equal('function');
                chai_1.expect(typeof rdf.setEnvironment).to.equal('function');
                if (lib === 'rdf-ext') {
                    chai_1.expect(typeof rdf).to.be.equal('function');
                }
                else {
                    chai_1.expect(typeof rdf).to.be.equal('object');
                }
                chai_1.expect(typeof defaults.TermMap).to.equal('function');
                chai_1.expect(typeof defaults.PrefixMap).to.equal('function');
                chai_1.expect(typeof defaults.Profile).to.equal('function');
                chai_1.expect(typeof defaults.RDFEnvironment).to.equal('function');
            });
            it('should detect extended library', () => {
                chai_1.expect(rdf.extendeeName()).to.equal(lib);
            });
            describe('TermMap', () => {
                let map = null;
                it('should create new TermMap', () => {
                    map = new defaults.TermMap();
                    chai_1.expect(typeof map).to.equal('object');
                    chai_1.expect(typeof map.map).to.equal('object');
                    chai_1.expect(typeof map.resolve).to.equal('function');
                    chai_1.expect(typeof map.shrink).to.equal('function');
                    chai_1.expect(typeof map.addAll).to.equal('function');
                });
                it('should throw error when term with white space or collon added', () => {
                    chai_1.expect(() => { map.set('white space'); }).to.throw();
                    chai_1.expect(() => { map.set('white\nspace'); }).to.throw();
                    chai_1.expect(() => { map.set('white\tspace'); }).to.throw();
                    chai_1.expect(() => { map.set(':colon:'); }).to.throw();
                });
                it('should add new term', () => {
                    map.set('me', 'http://example.com/#me');
                    chai_1.expect(map.get('me')).to.equal('http://example.com/#me');
                });
                it('should set default and get default if term not in map', () => {
                    map.setDefault('http://example.com/#');
                    chai_1.expect(map.default).to.equal('http://example.com/#');
                    chai_1.expect(map.get('undefined')).to.equal('http://example.com/#undefined');
                    chai_1.expect(map.get('me')).to.equal('http://example.com/#me');
                });
                it('should add multiple terms', () => {
                    const terms = new defaults.TermMap();
                    terms.set('john', 'http://john.example.com/#id');
                    terms.set('jane', 'http://jane.example.com/#person');
                    map.addAll(terms);
                    chai_1.expect(map.get('me')).to.equal('http://example.com/#me');
                    chai_1.expect(map.get('john')).to.equal('http://john.example.com/#id');
                    chai_1.expect(map.get('jane')).to.equal('http://jane.example.com/#person');
                });
                it('should clone', () => {
                    const terms = map.clone();
                    chai_1.expect(terms.get('me')).to.equal('http://example.com/#me');
                    chai_1.expect(terms.get('john')).to.equal('http://john.example.com/#id');
                    chai_1.expect(terms.get('jane')).to.equal('http://jane.example.com/#person');
                });
                it('should resolve', () => {
                    chai_1.expect(map.resolve('me')).to.equal('http://example.com/#me');
                    chai_1.expect(map.resolve('john')).to.equal('http://john.example.com/#id');
                    chai_1.expect(map.resolve('jane')).to.equal('http://jane.example.com/#person');
                    chai_1.expect(map.resolve('undefined')).to.equal('http://example.com/#undefined');
                });
                it('should shrink', () => {
                    chai_1.expect(map.shrink('http://example.com/#me')).to.equal('me');
                    chai_1.expect(map.shrink('http://john.example.com/#id')).to.equal('john');
                    chai_1.expect(map.shrink('http://jane.example.com/#person')).to.equal('jane');
                    chai_1.expect(map.shrink('http://example.com/#undefined')).to.equal(null);
                });
                it('should remove default (set null default)', () => {
                    map.setDefault(null);
                    chai_1.expect(map.default).to.equal(null);
                    chai_1.expect(map.get('undefined')).to.be.undefined;
                    chai_1.expect(map.get('me')).to.equal('http://example.com/#me');
                });
                it('should remove', () => {
                    map.remove('john');
                    chai_1.expect(map.get('me')).to.equal('http://example.com/#me');
                    chai_1.expect(map.get('john')).to.be.undefined;
                    chai_1.expect(map.get('jane')).to.equal('http://jane.example.com/#person');
                });
            });
            describe('PrefixMap', () => {
                let map = null;
                it('should create new PrefixMap', () => {
                    map = new defaults.PrefixMap();
                    chai_1.expect(typeof map).to.equal('object');
                    chai_1.expect(typeof map.resolve).to.equal('function');
                    chai_1.expect(typeof map.shrink).to.equal('function');
                    chai_1.expect(typeof map.addAll).to.equal('function');
                });
                it('should throw error when prefix with white space added', () => {
                    chai_1.expect(() => { map.set('white space'); }).to.throw();
                    chai_1.expect(() => { map.set('white\nspace'); }).to.throw();
                    chai_1.expect(() => { map.set('white\tspace'); }).to.throw();
                });
                it('should add new prefix', () => {
                    map.set('foaf', 'http://xmlns.com/foaf/0.1/');
                    chai_1.expect(map.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                });
                it('should set default and get default if prefix not in map', () => {
                    map.setDefault('http://example.com/ns#');
                    chai_1.expect(map.default).to.equal('http://example.com/ns#');
                    chai_1.expect(map.get('undefined')).to.equal('http://example.com/ns#');
                    chai_1.expect(map.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                });
                it('should add multiple prefixes', () => {
                    const prefixes = new defaults.PrefixMap();
                    prefixes.set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    prefixes.set('acl', 'http://www.w3.org/ns/auth/acl#');
                    map.addAll(prefixes);
                    chai_1.expect(map.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                    chai_1.expect(map.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    chai_1.expect(map.get('acl')).to.equal('http://www.w3.org/ns/auth/acl#');
                });
                it('should clone', () => {
                    const prefixes = map.clone();
                    chai_1.expect(prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                    chai_1.expect(prefixes.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    chai_1.expect(prefixes.get('acl')).to.equal('http://www.w3.org/ns/auth/acl#');
                });
                it('should resolve', () => {
                    chai_1.expect(map.resolve('foaf:Person')).to.equal('http://xmlns.com/foaf/0.1/Person');
                    chai_1.expect(map.resolve('rdf:type')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
                    chai_1.expect(map.resolve('foaf:knows')).to.equal('http://xmlns.com/foaf/0.1/knows');
                    chai_1.expect(map.resolve(':default')).to.equal('http://example.com/ns#default');
                    chai_1.expect(map.resolve('owl:Class')).to.equal(null);
                });
                it('should shrink', () => {
                    chai_1.expect(map.shrink('http://xmlns.com/foaf/0.1/Person')).to.equal('foaf:Person');
                    chai_1.expect(map.shrink('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')).to.equal('rdf:type');
                    chai_1.expect(map.shrink('http://xmlns.com/foaf/0.1/knows')).to.equal('foaf:knows');
                    chai_1.expect(map.shrink('http://example.com/ns#default')).to.equal(':default');
                    chai_1.expect(map.shrink('http://test.example.com/')).to.equal('http://test.example.com/');
                });
                it('should remove default (set null default)', () => {
                    map.setDefault(null);
                    chai_1.expect(map.default).to.equal(null);
                    chai_1.expect(map.resolve(':default')).to.equal(null);
                    chai_1.expect(map.resolve('foaf:Person')).to.equal('http://xmlns.com/foaf/0.1/Person');
                });
                it('should remove', () => {
                    map.remove('foaf');
                    chai_1.expect(map.get('foaf')).to.be.undefined;
                    chai_1.expect(map.resolve('foaf:knows')).to.equal(null);
                    chai_1.expect(map.resolve('rdf:type')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
                });
                it('should import from a stream', () => {
                    const stream = new events_1.EventEmitter();
                    const prefixes = new defaults.PrefixMap();
                    const result = prefixes.import(stream).then(() => {
                        chai_1.expect(prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                        chai_1.expect(prefixes.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    });
                    stream.emit('prefix', 'foaf', 'http://xmlns.com/foaf/0.1/');
                    stream.emit('prefix', 'rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    stream.emit('end');
                    return result;
                });
                it('should export prefixes to a stream', () => {
                    const stream = new events_1.EventEmitter();
                    const prefixes = new defaults.PrefixMap();
                    prefixes.set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    prefixes.set('acl', 'http://www.w3.org/ns/auth/acl#');
                    const result = {};
                    return new Promise((resolve) => {
                        stream.on('prefix', (prefix, namespace) => {
                            result[prefix] = namespace;
                            if (Object.keys(result).length === 2) {
                                chai_1.expect(result['rdf']).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                                chai_1.expect(result['acl']).to.equal('http://www.w3.org/ns/auth/acl#');
                                resolve();
                            }
                        });
                        prefixes.export(stream);
                    });
                });
            });
            describe('Profile', () => {
                let profile = null;
                let otherProfile = null;
                it('should create new Profile', () => {
                    profile = new defaults.Profile(rdf);
                    chai_1.expect(typeof profile).to.equal('object');
                    chai_1.expect(typeof profile.resolve).to.equal('function');
                    chai_1.expect(typeof profile.importProfile).to.equal('function');
                    chai_1.expect(typeof profile.setDefaultVocabulary).to.equal('function');
                });
                it('should set a prefix', () => {
                    profile.setPrefix('foaf', 'http://xmlns.com/foaf/0.1/');
                    chai_1.expect(profile.prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                });
                it('should set default prefix', () => {
                    profile.setDefaultPrefix('http://example.com/default-ns#');
                    chai_1.expect(profile.prefixes.default).to.equal('http://example.com/default-ns#');
                });
                it('should set a term', () => {
                    profile.setTerm('me', 'http://example.com/#me');
                    chai_1.expect(profile.terms.get('me')).to.equal('http://example.com/#me');
                });
                it('should set default term', () => {
                    profile.setDefaultVocabulary('http://default.example.com/#');
                    chai_1.expect(profile.terms.default).to.equal('http://default.example.com/#');
                });
                it('should save a custom data to pofileMap', () => {
                    profile.set('myData', { name: 'John', age: 42 });
                    const data = profile.get('myData');
                    chai_1.expect(data.name).to.equal('John');
                    chai_1.expect(data.age).to.equal(42);
                });
                it('should set factory', () => {
                    const factory = { _testIdentifier: 42 };
                    profile.setFactory(factory);
                    chai_1.expect(profile.factory._testIdentifier).to.equal(42);
                    profile.setFactory(null);
                    chai_1.expect(profile.factory).to.equals(null);
                });
                it('should import profile', () => {
                    otherProfile = new defaults.Profile(rdf);
                    otherProfile.setDefaultVocabulary('http://other.default.example.com/#');
                    otherProfile.setDefaultPrefix('http://example.com/other-default-ns#');
                    otherProfile.setPrefix('foaf', 'http://localhost/ns/foaf/');
                    otherProfile.setPrefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    otherProfile.setTerm('john', 'http://john.example.com/#id');
                    otherProfile.setTerm('me', 'http://example.com/profile/card#me');
                    otherProfile.set('myData', 'myValue');
                    otherProfile.set('myOtherData', 'myOtherValue');
                    profile.importProfile(otherProfile);
                    chai_1.expect(profile.prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                    chai_1.expect(profile.prefixes.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    chai_1.expect(profile.terms.get('john')).to.equal('http://john.example.com/#id');
                    chai_1.expect(profile.terms.get('me')).to.equal('http://example.com/#me');
                    chai_1.expect(profile.terms.default).to.equal('http://default.example.com/#');
                    chai_1.expect(profile.prefixes.default).to.equal('http://example.com/default-ns#');
                    chai_1.expect(profile.get('myData')['name']).to.equal('John');
                    chai_1.expect(profile.get('myOtherData')).to.equal('myOtherValue');
                });
                it('should import profile override', () => {
                    otherProfile.setTerm('jane', 'http://jane.example.com/#person');
                    profile.importProfile(otherProfile, true);
                    chai_1.expect(profile.prefixes.get('foaf')).to.equal('http://localhost/ns/foaf/');
                    chai_1.expect(profile.prefixes.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    chai_1.expect(profile.terms.get('john')).to.equal('http://john.example.com/#id');
                    chai_1.expect(profile.terms.get('me')).to.equal('http://example.com/profile/card#me');
                    chai_1.expect(profile.terms.default).to.equal('http://other.default.example.com/#');
                    chai_1.expect(profile.prefixes.default).to.equal('http://example.com/other-default-ns#');
                    chai_1.expect(profile.terms.get('jane')).to.equal('http://jane.example.com/#person');
                    chai_1.expect(profile.get('myData')).to.equal('myValue');
                    chai_1.expect(profile.get('myOtherData')).to.equal('myOtherValue');
                });
            });
            describe('RDFEnvironment', () => {
                let dflt = null;
                let env = null;
                it('should be possible to get default environment from the lib', () => {
                    dflt = rdf.environment();
                    chai_1.expect(dflt).to.equal(rdf._defaultEnvironment);
                });
                it('should be possible to create a new environment', () => {
                    env = new defaults.RDFEnvironment(rdf);
                    chai_1.expect(typeof env).to.equal('object');
                    chai_1.expect(typeof env.createLiteral).to.equal('function');
                    chai_1.expect(typeof env.createTriple).to.equal('function');
                    chai_1.expect(typeof env.createAction).to.equal('function');
                });
                it('should be possible to set prefix and/or term', () => {
                    env.setPrefix('foaf', 'http://xmlns.com/foaf/0.1/');
                    env.setTerm('me', 'http://example.com/#me');
                    chai_1.expect(env.prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                    chai_1.expect(env.terms.get('me')).to.equal('http://example.com/#me');
                });
                it('should throw error when createGraph and createAction methods are called', () => {
                    chai_1.expect(() => { env.createGraph(); }).to.throw('createGraph() not implemented');
                    chai_1.expect(() => { env.createAction(null, null); }).to.throw('createAction() not implemented');
                });
                it('should create an empty new PrefixMap', () => {
                    const empty = env.createPrefixMap(true);
                    chai_1.expect(Object.keys(empty.map).length).to.equal(0);
                });
                it('should create a copy of the env\'s PrefixMap', () => {
                    const copy = env.createPrefixMap();
                    chai_1.expect(Object.keys(copy.map).length).to.equal(1);
                    chai_1.expect(Object.keys(copy.map).length).to.equal(Object.keys(env.prefixes.map).length);
                });
                it('should create an empty new TermMap', () => {
                    const empty = env.createTermMap(true);
                    chai_1.expect(Object.keys(empty.map).length).to.equal(0);
                });
                it('should create a copy of the env\'s TermMap', () => {
                    const copy = env.createTermMap();
                    chai_1.expect(Object.keys(copy.map).length).to.equal(1);
                    chai_1.expect(Object.keys(copy.map).length).to.equal(Object.keys(env.terms.map).length);
                });
                it('should create an empty new Profile', () => {
                    const empty = env.createProfile(true);
                    chai_1.expect(Object.keys(empty.prefixes.map).length).to.equal(0);
                    chai_1.expect(Object.keys(empty.terms.map).length).to.equal(0);
                });
                it('should create a copy of the env\'s TermMap', () => {
                    const copy = env.createProfile();
                    chai_1.expect(Object.keys(copy.prefixes.map).length).to.equal(1);
                    chai_1.expect(Object.keys(copy.terms.map).length).to.equal(1);
                    chai_1.expect(Object.keys(copy.prefixes.map).length).to.equal(Object.keys(env.prefixes.map).length);
                    chai_1.expect(Object.keys(copy.terms.map).length).to.equal(Object.keys(env.terms.map).length);
                });
                if (rdf['blankNode']) {
                    it('should be possible create a blank node', () => {
                        chai_1.expect(env.createBlankNode().termType).to.equal('BlankNode');
                    });
                }
                if (rdf['namedNode']) {
                    it('should be possible create a named node', () => {
                        const nn = env.createNamedNode('http://localhost/ns/');
                        chai_1.expect(nn.termType).to.equal('NamedNode');
                        chai_1.expect(nn.value).to.equal('http://localhost/ns/');
                    });
                }
                if (rdf['literal']) {
                    it('should be possible create a literal', () => {
                        const customType = env.createNamedNode('http://localhost/some/datatype');
                        const stringType = env.createNamedNode('http://www.w3.org/2001/XMLSchema#string');
                        const langStringType = env.createNamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
                        const literal1 = env.createLiteral('value1');
                        const literal2 = env.createLiteral('value2', 'cs');
                        const literal3 = env.createLiteral('value3', null, customType);
                        const literal4 = env.createLiteral(4);
                        const literal5 = env.createLiteral('value5', 'sk', customType);
                        chai_1.expect(literal1.termType).to.equal('Literal');
                        chai_1.expect(literal2.termType).to.equal('Literal');
                        chai_1.expect(literal3.termType).to.equal('Literal');
                        chai_1.expect(literal4.termType).to.equal('Literal');
                        chai_1.expect(literal5.termType).to.equal('Literal');
                        chai_1.expect(literal1.value).to.equal('value1');
                        chai_1.expect(literal2.value).to.equal('value2');
                        chai_1.expect(literal3.value).to.equal('value3');
                        chai_1.expect(literal4.value).to.equal(4);
                        chai_1.expect(literal5.value).to.equal('value5');
                        chai_1.expect(literal1.language).to.equal('');
                        chai_1.expect(literal2.language).to.equal('cs');
                        chai_1.expect(literal3.language).to.equal('');
                        chai_1.expect(literal4.language).to.equal('');
                        chai_1.expect(literal5.language).to.equal('sk');
                        chai_1.expect(literal1.datatype.equals(stringType)).to.be.true;
                        chai_1.expect(literal2.datatype.equals(langStringType)).to.be.true;
                        chai_1.expect(literal3.datatype.equals(customType)).to.be.true;
                        chai_1.expect(literal4.datatype.equals(stringType)).to.be.true;
                        chai_1.expect(literal5.datatype.equals(langStringType)).to.be.true;
                    });
                }
                if (rdf['triple']) {
                    it('should be possible create a triple', () => {
                        const t = env.createTriple(env.createNamedNode('http://example.com/#me'), env.createNamedNode('http://xmlns.com/foaf/0.1/knows'), env.createNamedNode('http://john.example.com/#id'));
                        chai_1.expect(t.subject.value).to.equal('http://example.com/#me');
                        chai_1.expect(t.predicate.value).to.equal('http://xmlns.com/foaf/0.1/knows');
                        chai_1.expect(t.object.value).to.equal('http://john.example.com/#id');
                    });
                }
                if (rdf['quad']) {
                    it('should be possible create a quad', () => {
                        const q = env.createQuad(env.createNamedNode('http://example.com/#me'), env.createNamedNode('http://xmlns.com/foaf/0.1/knows'), env.createNamedNode('http://john.example.com/#id'), env.createNamedNode('http://example.com/kb1'));
                        chai_1.expect(q.subject.value).to.equal('http://example.com/#me');
                        chai_1.expect(q.predicate.value).to.equal('http://xmlns.com/foaf/0.1/knows');
                        chai_1.expect(q.object.value).to.equal('http://john.example.com/#id');
                        chai_1.expect(q.graph.value).to.equal('http://example.com/kb1');
                    });
                }
            });
        });
    }
});
