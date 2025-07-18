<script lang="ts" setup>
import { defineProps, ref } from 'vue'

import { useSocketStore } from '../stores/socket'
const props = defineProps<{
  code: string
  notes: string
}>()
const coderef = ref(props.code);
const notesref = ref(props.notes)
async function rematch() {
useSocketStore().socket?.emit("rematch");


}
</script>
<template>
  <div>
    <h2>Now compare the results!</h2>
    <p>
      I would encourage you to input the code into a proper interpreter, and check its real outcome.
    </p>
    <textarea name="code" id="code" cols="30" rows="10" v-model="coderef"></textarea>
    <textarea name="notes" id="notes" cols="30" rows="10" v-model="notesref" readonly></textarea><br>
    <button @click="rematch">Rematch</button>
  </div>
</template>
