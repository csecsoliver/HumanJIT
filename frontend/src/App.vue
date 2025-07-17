<script setup lang="ts">
import { ref } from 'vue'
import BackendStatus from './components/BackendStatus.vue'
import KnownServers from './components/KnownServers.vue'
import { io } from 'socket.io-client'
import { useSocketStore } from './stores/socket'
import type { RefSymbol } from '@vue/reactivity'
import CompilerUi from './components/CompilerUi.vue'
import CoderUi from './components/CoderUi.vue'
const role = ref('')
const players = ref(0)

async function refresh() {
  useSocketStore().socket?.once('state', (arg) => {
    role.value = arg.role
    players.value = arg.players
  })
  useSocketStore().socket?.emit('state')
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
    <CoderUi v-if="role == 'coder'"/>
    <CompilerUi v-else-if="role == 'compiler'" />

  </main>
</template>
