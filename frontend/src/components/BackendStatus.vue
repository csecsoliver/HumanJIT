<script lang="ts" setup>
import { useSocketStore } from '@/stores/socket'
import { ref, type Ref } from 'vue'

import { io } from 'socket.io-client'
import { constrainedMemory } from 'process'

const active = ref(useSocketStore().socket?.active)
const status = ref(useSocketStore().socket?.connected)
const loginDialog = ref(false)
const ip = ref('')
const room = ref('')
const playernum = ref('0')
const statusText: Ref<'Connecting...' | 'Disconnected.' | 'Connected.'> = ref('Disconnected.')
async function refresh() {
  if (useSocketStore().socket?.connected) {
    active.value = true
    status.value = true
  } else if (useSocketStore().socket?.active && !useSocketStore().socket?.connected) {
    active.value = true
    status.value = false
  } else {
    active.value = false
    status.value = false
  }
  console.log('connection refreshed')
}
async function connect() {
  useSocketStore().socket = io(ip.value, {autoConnect:false})

  useSocketStore().socket?.on('connected', () => {
    refresh();
    console.log('connected')
    statusText.value = 'Connected.'
    loginDialog.value = false;
  })
  statusText.value = 'Connecting...';
  useSocketStore().socket?.connect();
}
setInterval(refresh, 5000)
</script>

<template>
  <div v-if="active">
    Connection is {{ status ? 'healthy' : 'interrupted' }} to the server: {{ ip }}. You are player
    {{ playernum }}.
  </div>
  <div v-else>
    <a href="" @click.prevent="loginDialog = true">Click here to connect to a server.</a>
  </div>
  <dialog :open="loginDialog">
    <form @submit.prevent="connect">
      <label for="ip">Backend IP address or hostname: </label>
      <input id="ip" type="text" v-model="ip" required autofocus />
      <label for="room">Channel to join (2 player max for now): </label>
      <input id="room" type="text" v-model="room" required />
      <button type="submit" :disabled="statusText == 'Connecting...'">Connect</button>
      <p>{{ statusText }}</p>
    </form>
  </dialog>
</template>
