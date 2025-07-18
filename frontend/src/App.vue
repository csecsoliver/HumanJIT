<script setup lang="ts">
import { ref } from 'vue'
import BackendStatus from './components/BackendStatus.vue'
import { io } from 'socket.io-client'
import { useSocketStore } from './stores/socket'
import CompilerUi from './components/CompilerUi.vue'
import CoderUi from './components/CoderUi.vue'
import CompareCode from './components/CompareCode.vue'
import { watch } from 'vue'
const role = ref('')
const players = ref(0)
const done = ref(false)
const code = ref('')
const notes = ref('')

async function refresh() {
  useSocketStore().socket?.once('state', (arg) => {
    role.value = arg.role
    players.value = arg.players
  })
  useSocketStore().socket?.emit('state')
}

setInterval(refresh, 5000)

watch(role, (newRole, oldRole) => {
  useSocketStore().socket?.once('review', (arg: { code: string; notes: string }) => {
    code.value = arg.code
    notes.value = arg.notes
    done.value = true
    console.log(arg.code + arg.notes);
  })
  done.value = false;
})
</script>

<template>
  <header>
    <h1>HumanJIT</h1>
    <BackendStatus />
  </header>
  <main>
    <div v-if="role == ''">
      <p>
        Hello, and welcome to the coding practice game that's every vibecoder's nightmare. You will be
        playing against one of your friends, and challenging their coding skills
      </p>
      <p>
        The game has no real cheating prevention/request security, and in case you would want to play
        illegitimately, just don't even bother. Additionally, connection drops are not necessarily
        handled.
      </p>
    </div>
    <hr />
    <div v-if="!done">
      <CoderUi v-if="role == 'coder'" />
      <CompilerUi v-else-if="role == 'compiler'" />
    </div>

    <CompareCode v-else-if="done" :code="code" :notes="notes" />
  </main>
</template>
