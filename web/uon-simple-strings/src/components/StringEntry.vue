<script setup>

defineProps({
    name: String,
    value: String,
    edit: Boolean,
});

const emit = defineEmits(['edit']);

</script>

<template>
  <div class="entry">
    <div class="entry-source" v-html="name + ':'" />
    <div class="entry-value">
      <textarea class="entry-editor" v-html="value" :readonly="!edit"
                @input="ev => emit('edit', name, ev.target.value)"
                />
    </div>
  </div>
</template>

<style scoped>

.entry {
  padding-bottom: 2em;
  width: 100%;
}

.entry-source {
  background-color: black;
  padding: 8px;
  font-size: 18px;
  border-radius: 10px 10px 0px 0px;
}

.entry-value {
  background-color: #444;
  padding: 8px;
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
}

.entry-value > textarea {
  font-size: 16px;
}

.entry-editor {
  flex: 1 1 100%;
}

</style>
