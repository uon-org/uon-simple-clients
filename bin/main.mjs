#!/usr/bin/env node

import ps from 'node:process';
import {say, dbg, classof} from 'uon/util';

import {parsePath} from 'uon/opath';
import {Folder, Thing} from 'uon/SimpleObjects';

import {ListenerNull, ConnectionNull, proxify} from 'uon/Connection/Null';
import SimpleProto from 'uon/SimpleProto'
import Notify from 'uon/Notify'

const argv = ps.argv.slice(2);

if(argv.length < 1) {
    console.log('Instruction required');
    ps.exit(1);
}

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
    const foo  = root.set("foo", new Folder());
    const bar  = foo.set("bar", new Thing);
    const baz  = foo.set("baz", "a string");

    const proot = proxify(root);

    const remoteRoot = new Folder();
    const remoteQuux = remoteRoot.set("quux", new String("another string"));

    const listener = new ListenerNull({protoClass: SimpleProto, object: remoteRoot});
    const con =
        new ConnectionNull({name: "local", protoClass: SimpleProto, remote: listener, object: root});

    con.on('open', async (ref) => {
        say("opened");

        root.set("remote", ref);

        say("methods:", await ref._methods());

        const str   = argv.join(" ");
        const opath = parsePath(str);

        proot.index(parsePath("/remote/quux")).then(o => {
            o.toString().then(o => o.toUpperCase()).then(o => say("GOT:", o));

            Notify.watch(o, (o, m, ...a) => {
                say("Remote notify:", m, a);
            });

            Notify.notify(remoteQuux, "update");
        })

        //proot.index(opath).then(o => o.toUpperCase().then(o => dbg("OUT:", o)));
        //proot.index(opath).then(o => dbg("OUT:", o));

        // con.close();
    });

    con.on('close', () => { say("closed"); });
}
main();
