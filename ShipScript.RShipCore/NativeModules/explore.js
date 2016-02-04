﻿'use strict';
// ReSharper disable UndeclaredGlobalVariableUsing
const stdout = require('stdout');
const color = stdout.color;
const nativeProp = '{c2cf47d3-916b-4a3f-be2a-6ff567425808}';

function printString(str, longString) {
    if (!longString && str.length > 50) {
        var substr = str.substring(0, 50);
        stdout.write(`'${substr}`, color.dgreen);
        stdout.write('...', color.dgray);
        stdout.write('\'', color.dgreen);
    } else {
        stdout.write(`'${str}'`, color.dgreen);
    }
}

function printSimple(obj, longString) {
    if (obj === undefined) {
        stdout.write('undefined', color.dgray);
        return true;
    }

    if (obj === null) {
        stdout.write('null', color.white);
        return true;
    }

    if (EngineInternal.isVoid(obj)) {
        stdout.write('void', color.dmagenta);
        return true;
    }

    const type = typeof obj;
    if (type === 'string') {
        printString(obj, longString);
        return true;
    }

    if (type === 'number' || type === 'boolean' || obj instanceof RegExp) {
        stdout.write(obj.toString(), color.dyellow);
        return true;
    }

    return false;
}

function printObject(obj, parent) {
    if (obj === parent) {
        stdout.write('[Circular]', color.dcyan);
        return true;
    }

    if (!obj.constructor || !obj.constructor.name) {
        stdout.write('[Unknown]', color.dred);
        return true;
    }

    const name = obj.constructor.name;
    const col = obj.hasOwnProperty(nativeProp) ? color.dmagenta : color.dcyan;
    stdout.write(`[${name}]`, col);
    return true;
}

function explore(obj) {
    const printed = printSimple(obj, true);
    if (printed) {
        stdout.writeln();
        return;
    }

    var len;
    if (obj instanceof Array) {
        let cut = false;
        len = obj.length - 1;
        if (len === -1) {
            stdout.writeln('[]');
            return;
        }

        if (len > 200) {
            len = 200;
            cut = true;
        }

        stdout.write('[ ');
        let arrElement;
        for (let i = 0; i < len; i++) {
            arrElement = obj[i];
            printSimple(arrElement) || printObject(arrElement, obj);
            stdout.write(', ');
        }

        if (cut) {
            stdout.write('... ');
        }

        arrElement = obj[obj.length - 1];
        printSimple(arrElement) || printObject(arrElement, obj);
        stdout.writeln(' ]');
        return;
    }

    printObject(obj);
    stdout.write(' {');
    const properties = [];
    // ReSharper disable once MissingHasOwnPropertyInForeach
    for (let key in obj) {
        properties.push(key);
    }

    len = properties.length;
    const commas = len - 1;
    if (len === 0) {
        stdout.writeln('}');
        return;
    }

    stdout.writeln();
    for (let i = 0; i < len; i++) {
        let key = properties[i];
        stdout.write(`  ${key}: `);
        try {
            const val = obj[key];
            printSimple(val) || printObject(val, obj);
        }
        catch (err) {
            stdout.write('[Error]', color.dred);
        }

        if (i < commas) {
            stdout.writeln(',');
        } else {
            stdout.writeln();
        }
    }

    stdout.writeln('}');
}

module.exports = explore;
