<script setup lang="ts">
defineProps<{
	value?: string | null
}>()
</script>

<template>
	<Message v-if="value" size="small" severity="error" variant="simple" class="mt-2">
		{{ value }}
	</Message>
</template>