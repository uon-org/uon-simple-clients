<script setup>
import StringEntry from './StringEntry.vue';
import {say} from 'uon/util';

defineProps({
    data: Object,
})

</script>

<template>
  <div class="stringlist">
    <StringEntry name="webClient" :value="data.entries.webClient" :edit="true"
                 @edit="updateEntry"/>

    <template v-for="entry in Object.keys(data.entries)">
      <StringEntry v-if="entry != 'webClient'" :name="entry" :value="data.entries[entry]" />
    </template>
  </div>
</template>


<script>
export default {
    methods: {
        updateEntry(name, value) {
            console.log("update", name, value);
            //this.data.root.set(name, new String(value));
            this.data.remote.set(name, new String(value)).then(() => say("done"));
        },
    },
}
</script>
