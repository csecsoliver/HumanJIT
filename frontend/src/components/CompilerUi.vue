<script lang="ts" setup>
import { ref } from 'vue'
import { useSocketStore } from '@/stores/socket'

const role = ref('')
const line = ref('')
const notes = ref('')
const thinking = ref(true)
async function ack() {
  thinking.value = true
  line.value = 'Coder is coding...'
  useSocketStore().socket?.once('line', (arg) => {
    line.value = arg
    console.log(arg)
    thinking.value = false
  })
  useSocketStore().socket?.emit('ack')
}

useSocketStore().$subscribe(() => {
  if (useSocketStore().socket?.connected && role.value == '') {
    useSocketStore().socket?.once('line', (arg) => {
      line.value = arg
      console.log(arg)
      thinking.value = false
    })
    role.value = 'compiler'
  }
})
useSocketStore().socket?.once('line', (arg) => {
  line.value = arg
  console.log(arg)
  thinking.value = false
})
useSocketStore().socket?.on('notes:fetch', () => {
  useSocketStore().socket?.emit("notes:fetch", notes.value);

})

</script>
<template>
  <div>
    <p>
      You are the compiler, you are given a line of code every turn and you must keep track of the
      code in your notes field.
    </p>
    <p>
      You are not supposed to copy/save the lines you reveive, but take notes of the variables,
      function purposes, etc. in everyday language or just your own symbols
    </p>
    <hr />
    <p v-if="line == ''">Wait for a line from the coder.</p>
    <input type="text" readonly v-model="line" />
    <button :disabled="thinking" @click="ack">Understood</button><br />
    <p>Write your notes below, feel free to resize the textbox</p>
    <textarea name="notes" id="notes" v-model="notes"></textarea>
  </div>
</template>
