import { expect } from 'chai';
import { EventEmitter } from 'events';

import rdf_environment = require('..');

const libs = {
    'none': undefined,
    'rdflib': require('rdflib'),
    'rdf-ext': require('rdf-ext')
}
for (const lib in libs) {
    libs[lib] = rdf_environment(libs[lib]);
}

describe('Library rdf-environment', () => {
    for (const lib in libs) {
        describe('Mixed into '+lib, () => {
            const rdf = libs[lib];
            let defaults = rdf;
            if (lib === 'rdf-ext') {
                defaults = rdf.defaults;
            }
            it('should have added functions', () => {
                expect(typeof rdf.environment).to.equal('function');
                expect(typeof rdf.setEnvironment).to.equal('function');
                if (lib === 'rdf-ext') {
                    expect(typeof rdf).to.be.equal('function');
                } else {
                    expect(typeof rdf).to.be.equal('object');
                }
                expect(typeof defaults.TermMap).to.equal('function');
                expect(typeof defaults.PrefixMap).to.equal('function');
                expect(typeof defaults.Profile).to.equal('function');
                expect(typeof defaults.RDFEnvironment).to.equal('function');
            });
            it('should detect extended library', () => {
                expect(rdf.extendeeName()).to.equal(lib);
            });
            describe('TermMap', () => {
                let map = null;
                it('should create new TermMap', () => {
                    map = new defaults.TermMap();
                    expect(typeof map).to.equal('object');
                    expect(typeof map.map).to.equal('object');
                    expect(typeof map.resolve).to.equal('function');
                    expect(typeof map.shrink).to.equal('function');
                    expect(typeof map.addAll).to.equal('function');
                });
                it('should throw error when term with white space or collon added', () => {
                    expect(() => { map.set('white space'); }).to.throw();
                    expect(() => { map.set('white\nspace'); }).to.throw();
                    expect(() => { map.set('white\tspace'); }).to.throw();
                    expect(() => { map.set(':colon:'); }).to.throw();
                });
                it('should add new term', () => {
                    map.set('me', 'http://example.com/#me');
                    expect(map.get('me')).to.equal('http://example.com/#me');
                });
                it('should set default and get default if term not in map', () => {
                    map.setDefault('http://example.com/#');
                    expect(map.default).to.equal('http://example.com/#');
                    expect(map.get('undefined')).to.equal('http://example.com/#undefined');
                    expect(map.get('me')).to.equal('http://example.com/#me');
                });
                it('should add multiple terms', () => {
                    const terms = new defaults.TermMap();
                    terms.set('john', 'http://john.example.com/#id');
                    terms.set('jane', 'http://jane.example.com/#person');
                    map.addAll(terms);
                    expect(map.get('me')).to.equal('http://example.com/#me');
                    expect(map.get('john')).to.equal('http://john.example.com/#id');
                    expect(map.get('jane')).to.equal('http://jane.example.com/#person');
                });
                it('should clone', () => {
                    const terms = map.clone();
                    expect(terms.get('me')).to.equal('http://example.com/#me');
                    expect(terms.get('john')).to.equal('http://john.example.com/#id');
                    expect(terms.get('jane')).to.equal('http://jane.example.com/#person');
                });
                it('should resolve', () => {
                    expect(map.resolve('me')).to.equal('http://example.com/#me');
                    expect(map.resolve('john')).to.equal('http://john.example.com/#id');
                    expect(map.resolve('jane')).to.equal('http://jane.example.com/#person');
                    expect(map.resolve('undefined')).to.equal('http://example.com/#undefined');
                });
                it('should shrink', () => {
                    expect(map.shrink('http://example.com/#me')).to.equal('me');
                    expect(map.shrink('http://john.example.com/#id')).to.equal('john');
                    expect(map.shrink('http://jane.example.com/#person')).to.equal('jane');
                    expect(map.shrink('http://example.com/#undefined')).to.equal(null);
                });
                it('should remove default (set null default)', () => {
                    map.setDefault(null);
                    expect(map.default).to.equal(null);
                    expect(map.get('undefined')).to.be.undefined;
                    expect(map.get('me')).to.equal('http://example.com/#me');
                });
                it('should remove', () => {
                    map.remove('john');
                    expect(map.get('me')).to.equal('http://example.com/#me');
                    expect(map.get('john')).to.be.undefined;
                    expect(map.get('jane')).to.equal('http://jane.example.com/#person');
                });
            });
            describe('PrefixMap', () => {
                let map = null;
                it('should create new PrefixMap', () => {
                    map = new defaults.PrefixMap();
                    expect(typeof map).to.equal('object');
                    expect(typeof map.resolve).to.equal('function');
                    expect(typeof map.shrink).to.equal('function');
                    expect(typeof map.addAll).to.equal('function');
                });
                it('should throw error when prefix with white space added', () => {
                    expect(() => { map.set('white space'); }).to.throw();
                    expect(() => { map.set('white\nspace'); }).to.throw();
                    expect(() => { map.set('white\tspace'); }).to.throw();
                });
                it('should add new prefix', () => {
                    map.set('foaf', 'http://xmlns.com/foaf/0.1/');
                    expect(map.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                });
                it('should set default and get default if prefix not in map', () => {
                    map.setDefault('http://example.com/ns#');
                    expect(map.default).to.equal('http://example.com/ns#');
                    expect(map.get('undefined')).to.equal('http://example.com/ns#');
                    expect(map.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                });
                it('should add multiple prefixes', () => {
                    const prefixes = new defaults.PrefixMap();
                    prefixes.set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    prefixes.set('acl', 'http://www.w3.org/ns/auth/acl#');
                    map.addAll(prefixes);
                    expect(map.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                    expect(map.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    expect(map.get('acl')).to.equal('http://www.w3.org/ns/auth/acl#');
                });
                it('should clone', () => {
                    const prefixes = map.clone();
                    expect(prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                    expect(prefixes.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    expect(prefixes.get('acl')).to.equal('http://www.w3.org/ns/auth/acl#');
                });
                it('should resolve', () => {
                    expect(map.resolve('foaf:Person')).to.equal('http://xmlns.com/foaf/0.1/Person');
                    expect(map.resolve('rdf:type')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
                    expect(map.resolve('foaf:knows')).to.equal('http://xmlns.com/foaf/0.1/knows');
                    expect(map.resolve(':default')).to.equal('http://example.com/ns#default');
                    expect(map.resolve('owl:Class')).to.equal(null);
                });
                it('should shrink', () => {
                    expect(map.shrink('http://xmlns.com/foaf/0.1/Person')).to.equal('foaf:Person');
                    expect(map.shrink('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')).to.equal('rdf:type');
                    expect(map.shrink('http://xmlns.com/foaf/0.1/knows')).to.equal('foaf:knows');
                    expect(map.shrink('http://example.com/ns#default')).to.equal(':default');
                    expect(map.shrink('http://test.example.com/')).to.equal('http://test.example.com/');
                });
                it('should remove default (set null default)', () => {
                    map.setDefault(null);
                    expect(map.default).to.equal(null);
                    expect(map.resolve(':default')).to.equal(null);
                    expect(map.resolve('foaf:Person')).to.equal('http://xmlns.com/foaf/0.1/Person');
                });
                it('should remove', () => {
                    map.remove('foaf');
                    expect(map.get('foaf')).to.be.undefined;
                    expect(map.resolve('foaf:knows')).to.equal(null);
                    expect(map.resolve('rdf:type')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
                });
                it('should import from a stream', () => {
                    const stream = new EventEmitter();
                    const prefixes = new defaults.PrefixMap();
                    const result = prefixes.import(stream).then(() => {
                        expect(prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                        expect(prefixes.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    })
                    stream.emit('prefix', 'foaf', 'http://xmlns.com/foaf/0.1/');
                    stream.emit('prefix', 'rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    stream.emit('end')
                    return result
                });
                it('should export prefixes to a stream', () => {
                    const stream = new EventEmitter()
                    const prefixes = new defaults.PrefixMap();
                    prefixes.set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    prefixes.set('acl', 'http://www.w3.org/ns/auth/acl#');
                    const result = {};
                    return new Promise((resolve) => {
                        stream.on('prefix', (prefix, namespace) => {
                            result[prefix] = namespace;
                            if (Object.keys(result).length === 2) {
                                expect(result['rdf']).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                                expect(result['acl']).to.equal('http://www.w3.org/ns/auth/acl#');
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
                    expect(typeof profile).to.equal('object');
                    expect(typeof profile.resolve).to.equal('function');
                    expect(typeof profile.importProfile).to.equal('function');
                    expect(typeof profile.setDefaultVocabulary).to.equal('function');
                });
                it('should set a prefix', () => {
                    profile.setPrefix('foaf', 'http://xmlns.com/foaf/0.1/');
                    expect(profile.prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                });
                it('should set default prefix', () => {
                    profile.setDefaultPrefix('http://example.com/default-ns#');
                    expect(profile.prefixes.default).to.equal('http://example.com/default-ns#');
                });
                it('should set a term', () => {
                    profile.setTerm('me', 'http://example.com/#me');
                    expect(profile.terms.get('me')).to.equal('http://example.com/#me');
                });
                it('should set default term', () => {
                    profile.setDefaultVocabulary('http://default.example.com/#');
                    expect(profile.terms.default).to.equal('http://default.example.com/#');
                });
                it('should save a custom data to pofileMap', () => {
                    profile.set('myData', { name: 'John', age: 42 });
                    const data = profile.get('myData');
                    expect(data.name).to.equal('John');
                    expect(data.age).to.equal(42);
                });

                it('should set factory', () => {
                    const factory = { _testIdentifier: 42 };
                    profile.setFactory(factory);
                    expect(profile.factory._testIdentifier).to.equal(42);
                    profile.setFactory(null);
                    expect(profile.factory).to.equals(null);
                });
                it('should import profile', () => {
                    otherProfile = new defaults.Profile(rdf);
                    otherProfile.setDefaultVocabulary('http://other.default.example.com/#');
                    otherProfile.setDefaultPrefix('http://example.com/other-default-ns#');
                    otherProfile.setPrefix('foaf', 'http://localhost/ns/foaf/');
                    otherProfile.setPrefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    otherProfile.setTerm('john', 'http://john.example.com/#id');
                    otherProfile.setTerm('me', 'http://example.com/profile/card#me');
                    profile.importProfile(otherProfile);
                    expect(profile.prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                    expect(profile.prefixes.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    expect(profile.terms.get('john')).to.equal('http://john.example.com/#id');
                    expect(profile.terms.get('me')).to.equal('http://example.com/#me');
                    expect(profile.terms.default).to.equal('http://default.example.com/#');
                    expect(profile.prefixes.default).to.equal('http://example.com/default-ns#');
                });
                it('should import profile override', () => {
                    otherProfile.setTerm('jane', 'http://jane.example.com/#person');
                    profile.importProfile(otherProfile, true);
                    expect(profile.prefixes.get('foaf')).to.equal('http://localhost/ns/foaf/');
                    expect(profile.prefixes.get('rdf')).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
                    expect(profile.terms.get('john')).to.equal('http://john.example.com/#id');
                    expect(profile.terms.get('me')).to.equal('http://example.com/profile/card#me');
                    expect(profile.terms.default).to.equal('http://other.default.example.com/#');
                    expect(profile.prefixes.default).to.equal('http://example.com/other-default-ns#');
                    expect(profile.terms.get('jane')).to.equal('http://jane.example.com/#person');
                });
            });
            describe('RDFEnvironment', () => {
                let dflt = null;
                let env = null;
                it('should be possible to get default environment from the lib', () => {
                    dflt = rdf.environment();
                    expect(dflt).to.equal(rdf._defaultEnvironment);
                });
                it('should be possible to create a new environment', () => {
                    env = new defaults.RDFEnvironment(rdf);
                    expect(typeof env).to.equal('object');
                    expect(typeof env.createLiteral).to.equal('function');
                    expect(typeof env.createTriple).to.equal('function');
                    expect(typeof env.createAction).to.equal('function');
                });
                it('should be possible to set prefix and/or term', () => {
                    env.setPrefix('foaf', 'http://xmlns.com/foaf/0.1/');
                    env.setTerm('me', 'http://example.com/#me');
                    expect(env.prefixes.get('foaf')).to.equal('http://xmlns.com/foaf/0.1/');
                    expect(env.terms.get('me')).to.equal('http://example.com/#me');
                });
                it('should throw error when createGraph and createAction methods are called', () => {
                    expect(() => { env.createGraph(); }).to.throw('createGraph() not implemented');
                    expect(() => { env.createAction(null, null); }).to.throw('createAction() not implemented');
                });
                it('should create an empty new PrefixMap', () => {
                    const empty = env.createPrefixMap(true);
                    expect(Object.keys(empty.map).length).to.equal(0);
                });
                it('should create a copy of the env\'s PrefixMap', () => {
                    const copy = env.createPrefixMap();
                    expect(Object.keys(copy.map).length).to.equal(1);
                    expect(Object.keys(copy.map).length).to.equal(Object.keys(env.prefixes.map).length);
                });
                it('should create an empty new TermMap', () => {
                    const empty = env.createTermMap(true);
                    expect(Object.keys(empty.map).length).to.equal(0);
                });
                it('should create a copy of the env\'s TermMap', () => {
                    const copy = env.createTermMap();
                    expect(Object.keys(copy.map).length).to.equal(1);
                    expect(Object.keys(copy.map).length).to.equal(Object.keys(env.terms.map).length);
                });
                it('should create an empty new Profile', () => {
                    const empty = env.createProfile(true);
                    expect(Object.keys(empty.prefixes.map).length).to.equal(0);
                    expect(Object.keys(empty.terms.map).length).to.equal(0);
                });
                it('should create a copy of the env\'s TermMap', () => {
                    const copy = env.createProfile();
                    expect(Object.keys(copy.prefixes.map).length).to.equal(1);
                    expect(Object.keys(copy.terms.map).length).to.equal(1);
                    expect(Object.keys(copy.prefixes.map).length).to.equal(Object.keys(env.prefixes.map).length);
                    expect(Object.keys(copy.terms.map).length).to.equal(Object.keys(env.terms.map).length);
                });
                if (rdf['blankNode']) {
                    it('should be possible create a blank node', () => {
                        expect(env.createBlankNode().termType).to.equal('BlankNode');
                    });
                }
                if (rdf['namedNode']) {
                    it('should be possible create a named node', () => {
                        const nn = env.createNamedNode('http://localhost/ns/');
                        expect(nn.termType).to.equal('NamedNode');
                        expect(nn.value).to.equal('http://localhost/ns/');
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
                        expect(literal1.termType).to.equal('Literal');
                        expect(literal2.termType).to.equal('Literal');
                        expect(literal3.termType).to.equal('Literal');
                        expect(literal4.termType).to.equal('Literal');
                        expect(literal5.termType).to.equal('Literal');
                        expect(literal1.value).to.equal('value1');
                        expect(literal2.value).to.equal('value2');
                        expect(literal3.value).to.equal('value3');
                        expect(literal4.value).to.equal(4);
                        expect(literal5.value).to.equal('value5');
                        expect(literal1.language).to.equal('');
                        expect(literal2.language).to.equal('cs');
                        expect(literal3.language).to.equal('');
                        expect(literal4.language).to.equal('');
                        expect(literal5.language).to.equal('sk');
                        expect(literal1.datatype.equals(stringType)).to.be.true;
                        expect(literal2.datatype.equals(langStringType)).to.be.true;
                        expect(literal3.datatype.equals(customType)).to.be.true;
                        expect(literal4.datatype.equals(stringType)).to.be.true;
                        expect(literal5.datatype.equals(langStringType)).to.be.true;
                    });
                }
                if (rdf['triple']) {
                    it('should be possible create a triple', () => {
                        const t = env.createTriple(
                            env.createNamedNode('http://example.com/#me'),
                            env.createNamedNode('http://xmlns.com/foaf/0.1/knows'),
                            env.createNamedNode('http://john.example.com/#id')
                        );
                        expect(t.subject.value).to.equal('http://example.com/#me');
                        expect(t.predicate.value).to.equal('http://xmlns.com/foaf/0.1/knows');
                        expect(t.object.value).to.equal('http://john.example.com/#id');
                    });
                }
                if (rdf['quad']) {
                    it('should be possible create a quad', () => {
                        const q = env.createQuad(
                            env.createNamedNode('http://example.com/#me'),
                            env.createNamedNode('http://xmlns.com/foaf/0.1/knows'),
                            env.createNamedNode('http://john.example.com/#id'),
                            env.createNamedNode('http://example.com/kb1')
                        );
                        expect(q.subject.value).to.equal('http://example.com/#me');
                        expect(q.predicate.value).to.equal('http://xmlns.com/foaf/0.1/knows');
                        expect(q.object.value).to.equal('http://john.example.com/#id');
                        expect(q.graph.value).to.equal('http://example.com/kb1');
                    });
                }
            });
        });
    }
});
