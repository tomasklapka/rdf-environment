"use strict";
const debug_1 = require("./debug");
const debug = debug_1.getDebug('mixin');
const term_map_1 = require("./term-map");
const prefix_map_1 = require("./prefix-map");
const profile_1 = require("./profile");
const rdf_environment_1 = require("./rdf-environment");
function mixin(object) {
    // detect and add info about extended object - extendee
    let _extendeeName = 'none';
    if (object) {
        _extendeeName = 'unknown';
    }
    else {
        object = {};
    }
    if (object['IndexedFormula'] && object['lit']) {
        _extendeeName = 'rdflib';
    }
    else {
        if (object['defaults'] && object.defaults['Dataset'] && object['waitFor']) {
            _extendeeName = 'rdf-ext';
        }
    }
    object._extendeeName = _extendeeName;
    object._extendee = object;
    const newClasses = {
        TermMap: term_map_1.TermMap,
        PrefixMap: prefix_map_1.PrefixMap,
        Profile: profile_1.Profile,
        RDFEnvironment: rdf_environment_1.RDFEnvironment
    };
    // add new types
    for (const newClass in newClasses) {
        if (_extendeeName === 'rdf-ext') {
            object.defaults[newClass] = newClasses[newClass];
        }
        else {
            object[newClass] = newClasses[newClass];
        }
    }
    if (_extendeeName !== 'rdf-ext' && !object['defaults']) {
        object.defaults = newClasses;
    }
    // setup default environment
    object._defaultEnvironment = new rdf_environment_1.RDFEnvironment(object);
    object._environment = object._defaultEnvironment;
    // get/set methods
    object.extendeeName = () => { return object._extendeeName; };
    object.environment = () => { return object._environment; };
    object.setEnvironment = (env) => { object._environment = env; return object; };
    debug(object);
    return object;
}
module.exports = mixin;
