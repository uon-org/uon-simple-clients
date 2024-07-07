<template>
  <StringList :data="data" />
</template>

<script>
import StringList from './components/StringList.vue'

import {ConnectionBrowserWS, proxify} from 'uon/Connection/BrowserWS';
import {parsePath} from 'uon/opath';
import {Folder, Thing} from 'uon/SimpleObjects';
import SimpleProto from 'uon/SimpleProto';

import Notify from 'uon/Notify';

import {say} from 'uon/util';

export default {
    components: { StringList },

    data() {
        return { data: {entries: {}} };
    },

    created() {
        const root = new Folder();
        root.set("name", "webClient");
        root.set("str", new String());

        const con = new ConnectionBrowserWS({
            url: 'ws://localhost:8080',
            protoClass: SimpleProto,
            object: root,
        });
        this.con = con;
        this.data.root = root;

        con.on('open', (ref, con) => {
            this.data.remote = ref;

            Notify.watch(ref, (o, m, ...args) => {
                switch(m) {
                    case 'update': return this.update(o, ...args);
                }
            });
        });
    },

    methods: {
        update(obj) {
            obj.list().then(entries => {
                const tasks = entries.map(
                    async entry =>
                    obj.index(parsePath("/" + entry))
                        .then(val => proxify(val).toString())
                        .then(str => { return {source: entry, value: str} }));

                Promise.all(tasks).then(a => {
                    const v = {};
                    for(const e of a) v[e.source] = e.value;

                    this.data.entries = v;
                });
            });
        },
    },
}
</script>
