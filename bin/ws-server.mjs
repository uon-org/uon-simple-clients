#!/usr/bin/env node

import {readFileSync} from 'node:fs';
import SimpleProto from 'uon/SimpleProto';
import {parsePath} from 'uon/opath';

import {Folder, Thing} from 'uon/SimpleObjects';

import {ListenerWS, proxify} from 'uon/Connection/WS'
import Notify from 'uon/Notify'

import {say, classof} from 'uon/util';

const root = new Folder();

const listener = new ListenerWS({
    useTLS: false,
    protoClass: SimpleProto,

    object: root,

    serverOptions: {
        // cert: readFileSync('...crt.pem'),
        // key: readFileSync('...key.pem'),
    },
});

listener.on('open', (obj, con) => {
    let client;

    obj.index(parsePath("/name")).then(clientName => {
        client = clientName;

        say("remote:", client);
        obj.index(parsePath("/str")).then(str => {
            root.set(client, str);
        });
    });

    con.on('close', (...args) => {
        root.rm(client);
        Notify.notify(root, "update");
    });
})
listener.listen(8080);
