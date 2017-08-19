const PKGNAME = require('../package.json').name;
import * as debug from 'debug';
export function getDebug(aftercolon?: string) {
    return debug(PKGNAME+((aftercolon) ? ':'+aftercolon : ''));
}
export function getFnDebug(aftercolon?: string) {
    return debug(PKGNAME+((aftercolon) ? ':fn:'+aftercolon : 'fn:'))
}
