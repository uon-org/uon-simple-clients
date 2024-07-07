#!/usr/bin/env node

import test from 'node:test';
import { strict as assert } from 'node:assert';

import { parsePath, OPath } from 'uon/opath';

test('parsePath', (t) => {
    let p  = '/a\\/b/c';
    let op = parsePath(p);
    assert.strictEqual(op.toString(), p);

    let op2 = parsePath(op.toString());
    assert.strictEqual(op2.toString(), p);
});
