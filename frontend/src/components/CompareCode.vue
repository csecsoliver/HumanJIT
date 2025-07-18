<script lang="ts" setup>
import { defineProps } from 'vue'

import { useSocketStore } from '../stores/socket'
const props = defineProps<{
  code: string
  notes: string
}>()
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
    <textarea name="code" id="code" cols="30" rows="10"></textarea>
    <textarea name="notes" id="notes" cols="30" rows="10"></textarea><br>
    <button @click="rematch">Rematch</button>
  </div>
</template>
