import { getDebug, getFnDebug } from './debug';
const debug = getDebug('mixin');

import I = require('./rdf-interfaces');
import { IProfile, IRDFEnvironment } from './rdf-interfaces';
import { TermMap } from './term-map';
import { PrefixMap } from './prefix-map';
import { Profile } from './profile';
import { RDFEnvironment } from './rdf-environment';

function mixin(object?) {

    // detect and add info about extended object - extendee
    let _extendeeName = 'none';
    if (object) {
        _extendeeName = 'unknown';
    } else {
        object = {};
    }
    if (object['IndexedFormula'] && object ['lit']) {
        _extendeeName = 'rdflib';
    } else {
        if (object['defaults'] && object.defaults['Dataset'] && object['waitFor']) {
            _extendeeName = 'rdf-ext';
        }
    }
    object._extendeeName = _extendeeName;
    object._extendee = object;

    const newClasses = {
        TermMap: TermMap,
        PrefixMap: PrefixMap,
        Profile: Profile,
        RDFEnvironment: RDFEnvironment
    }
    // add new types
    for (const newClass in newClasses) {
        if (_extendeeName === 'rdf-ext') {
            object.defaults[newClass] = newClasses[newClass]; 
        } else {
            object[newClass] = newClasses[newClass];
        }
    }
    if (_extendeeName !== 'rdf-ext' && !object['defaults']) {
        object.defaults = newClasses;
    }
    object._interfaces = I;

    // setup default environment
    object._defaultEnvironment = new RDFEnvironment(object);
    object._environment = object._defaultEnvironment;

    // get/set methods
    object.interfaces = () => { return object._interfaces};
    object.extendeeName = (): string => { return object._extendeeName; }
    object.environment = (): IRDFEnvironment => { return object._environment; }
    object.setEnvironment = (env: IRDFEnvironment) => { object._environment = env; return object; }

    debug(object);

    return object;
}

export = mixin;