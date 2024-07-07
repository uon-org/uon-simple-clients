#!/usr/bin/env node

import ps from 'node:process';
import util from 'node:util';
import {say, dbg, classof} from 'uon/util';

import {parsePath} from 'uon/opath';
import {Folder, Thing} from 'uon/SimpleObjects';

import {Ref, proxify} from 'uon/Connection';
import {ConnectionWS} from 'uon/Connection/WS';
import SimpleProto from 'uon/SimpleProto'

import Notify from 'uon/Notify'

const argv = ps.argv.slice(2);

function showNotification(o, ...args)
{
    console.log("Notification: obj:", o, "args:", ...args);
}

class StringValue extends String {
    value() { return this.valueOf(); }
}

function main()
{
    const root = new Folder();
    const name = root.set("name", argv[0] ? argv[0] : "unnamed");
    const bar  = root.set("str", new String(argv[1] ? argv[1] : "no string given"));

    const con = new ConnectionWS({
        url: 'ws://localhost:8080',
        protoClass: SimpleProto,
        object: root,
    });

    con.on('open', async (ref) => {
        root.set("remote", ref);

        Notify.watch(ref, (o, m, ...a) => {
            o.list().then(entries => {
                say("Remote folder update:", entries);
                for(const entry of entries) {
                    o.index(parsePath("/" + entry))
                        .then(val => proxify(val).toString())
                        .then(str => say("  ", entry, "=>", str))
                }
            });
        });
    });
}
main();
