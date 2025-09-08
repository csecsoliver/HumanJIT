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
      <h2>Below are the github readme contents</h2>
      <p>
        # HumanJIT <br>
This is a fun little coding practice game, that's all about understanding code line by line. You send the baackend url and room name to one of your friends and start battling it out. It has no syntax highlighting, or any other comforts present in a regular ide, meaning it can reveal your true knowledge of the language. Talking about languages, this app can facilitate EVERY one that uses an ASCII characterset. (it might be unicode, but I am not sure and will not check) <br>
<br>
You can host it yourself by running "sudo sh ./install.sh" after downloading the repo. The sudo is only needed if your environment does not allow port 80 to be used by normal users.<br>
<br>
<br>
# Tutorial<br>
<br>
1. You get together with someone and send them the website link and the backend link, usually the same.<br>
2. You both connect to the same channel (choose freely) and the coder starts writing their code.<br>
3. Once done, they submit their line and the compiler interprets it.<br>
4. Once ok, the compiler clicks understood and the coder can continue.<br>
5. If the coder is finished, they can click the finish button to review the code.<br>
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
