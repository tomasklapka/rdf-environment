"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PKGNAME = require('../package.json').name;
const debug = require("debug");
function getDebug(aftercolon) {
    return debug(PKGNAME + ((aftercolon) ? ':' + aftercolon : ''));
}
exports.getDebug = getDebug;
function getFnDebug(aftercolon) {
    return debug(PKGNAME + ((aftercolon) ? ':fn:' + aftercolon : 'fn:'));
}
exports.getFnDebug = getFnDebug;
