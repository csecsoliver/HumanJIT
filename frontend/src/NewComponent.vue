<script setup lang="ts">
defineProps<{
	ack: () => Promise<void>;
	thinking: boolean;
}>()
const role = defineModel<string>('role', { required: true })
const line = defineModel<string>('line', { required: true })
</script>

<template>
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
</template>
