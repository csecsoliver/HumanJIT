<script setup lang="ts">
import { ref } from 'vue'
import BackendStatus from './components/BackendStatus.vue'
import KnownServers from './components/KnownServers.vue'
import { io } from 'socket.io-client'
import { useSocketStore } from './stores/socket'
import type { RefSymbol } from '@vue/reactivity'
const role = ref('')
const players = ref(0)
const line = ref('')

const code = ref('')
const thinking = ref(false)
async function refresh() {
  useSocketStore().socket?.once('state', (arg) => {
    role.value = arg.role
    players.value = arg.players
  })
  useSocketStore().socket?.emit('state')
  useSocketStore().socket?.off('line')
  useSocketStore().socket?.on('line', (arg) => {
    console.log(arg);
    if (role.value == 'compiler') {
      line.value = arg;
      thinking.value = false;
    }
  })
}
async function submitLine() {
  thinking.value = true
  useSocketStore().socket?.once('code', (arg) => {
    code.value = ''
    for (const i of arg as string[]) {
      code.value = code.value + i + '\n'
    }
  })
  console.log(line.value)
  useSocketStore().socket?.emit('line', line.value)
  line.value = ''
  useSocketStore().socket?.once('ack', () => {
    thinking.value = false
    line.value = ''
  })
}
async function ack() {
  thinking.value = true
}
setInterval(refresh, 5000)
</script>

<template>
  <header>
    <h1>HumanJIT</h1>
    <BackendStatus />
  </header>
  <main>
    <p>
      Hello, and welcome to the coding practice game that's every vibecoder's nightmare. You will be
      playing against one of your friends, and challenging their coding skills
    </p>

    <p>
      The game has no real cheating prevention/request security, and in case you would want to play
      illegitimately, just don't even bother. Additionally, connection drops are not necessarily
      handled.
    </p>
    <hr />
    <div v-if="role == 'coder'">
      <p>
        You are the coder, your partner can only get to see your newest line after you send it. You
        can only submit a new line once your partner has acknowledged your previous one.
      </p>
      <hr />
      <label for="code">Your existing code</label><br />
      <textarea name="code" id="code" v-model="code" readonly></textarea>
      <form @submit.prevent="submitLine">
        <label for="line">Your next line: </label><br />
        <input type="text" name="line" id="line" v-model="line" :readonly="thinking" />
        <button type="submit" :disabled="thinking">Submit line</button>
      </form>
      <p>
        To finish writing your code, and compare with your partner's results, press the button
        below.
      </p>
      <button @click="">Finish</button>
    </div>
    <div v-else-if="role == 'compiler'">
      <p>
        You are the compiler, you are given a line of code every turn and you must keep track of the
        code in your notes field.
      </p>
      <p>
        You are not supposed to copy/save the lines you reveive, but take notes of the variables,
        function purposes, etc. in everyday language or just your own symbols
      </p>
      <hr />
      <p v-if="line == ''">Wait for the coder to make the first move</p>
      <input type="text" readonly v-model="line" />
      <button :disabled="thinking" @click="ack">Understood</button><br />
      <p>Write your notes below, feel free to resize the textbox</p>
      <textarea name="notes" id="notes"></textarea>
    </div>
  </main>
</template>
