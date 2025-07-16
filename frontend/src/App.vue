<script setup lang="ts">
import { ref } from 'vue'
import BackendStatus from './components/BackendStatus.vue'
import KnownServers from './components/KnownServers.vue'
import { io } from "socket.io-client";
import { useSocketStore } from './stores/socket';
const role = ref("")
const players = ref(0);
const line = ref("");

const code = ref("");
const thinking = ref(false);
async function refresh() {
  useSocketStore().socket?.once("state", (arg)=>{
    role.value = arg.role;
    players.value = arg.players;
  })
  useSocketStore().socket?.emit("state")
}
async function submitLine() {
  thinking.value = true;
  useSocketStore().socket?.once("code", (arg) => {
    code.value = ""
    for (const i of JSON.parse(arg) as string[]){
      code.value = code.value + i + "\n"
    }
  })
  useSocketStore().socket?.emit("line", line);
  useSocketStore().socket?.once("ack", ()=>{
    thinking.value = false;
    line.value = "";
  })
}
setInterval(refresh, 1000)
</script>

<template>
  <header>
    <h1>HumanJIT</h1>
    <BackendStatus />
  </header>
  <main>
    <p>Hello, and welcome to the coding practice game that's every vibecoder's nightmare. You will be playing against one of your friends, and challenging their coding skills</p>

    <p>The game has no real cheating prevention/request security, and in case you would want to play illegitimately, just don't even bother.</p>
    <div v-if="role == 'coder'">
      <p>You are the coder, your partner can only get see your newest line after you send it. You can only submit a new line once your partner has acknowledged your previous one.</p>
      <label for="code">Your existing code</label>
      <textarea name="code" id="code" v-model="code" readonly></textarea>
      <form @submit.prevent="submitLine">
        <label for="line">Your next line: </label>
        <input type="text" name="line" id="line" v-model="line" :readonly="thinking">
        <button type="submit" :disabled="thinking">Submit line</button>
      </form>
      <p>To finish writing your code, and compare with your partner's results, press the button below.</p>
      <button @click="finish">Finish</button>
    </div>
    <div v-else-if="role == 'compiler'">
      <p>You are the compiler, you are given a line of code every turn and you must keep track of the code in your notes field.</p>
      <p>You are not supposed to copy/save the lines you reveive, but take notes of the variables, function purposes, etc. in everyday language or just your own symbols</p>
      <p v-if="line == ''"></p>
      <input type="text" readonly v-model="line">


    </div>
  </main>
</template>
