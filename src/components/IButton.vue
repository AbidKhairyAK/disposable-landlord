<script setup lang="ts">

// FIXME - Perlu cara untuk passthrough props, event, dan slots ke component Button dari primevue
// FIXME - sekalian bisa modif atau nambahin props selagi passthrough

import Button from "primevue/button"
import type { LucideIcon } from "lucide-vue-next";
import { merge_class } from "@/lib/utils";

const props = defineProps<{
	lucide?: LucideIcon
	severity?: string
	lucideClass?: string
	class?: string
}>()

</script>

<template>
	<Button 
		:class="merge_class(props.class, 'transition-all! active:scale-90')" 
		:severity="severity"
	>
		<template v-if="lucide" #icon>
			<component :is="lucide" :class="['w-4 h-4', (severity === 'secondary' ? 'text-primary' : 'text-primary-contrast'), lucideClass]" />
		</template>
	</Button>
</template>