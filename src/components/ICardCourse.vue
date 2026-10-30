<script setup lang="ts">
import { computed } from 'vue';
import noImage from '@/assets/images/noimage.jpg';
import { FlagIcon, GraduationCapIcon, LockIcon, StarIcon } from 'lucide-vue-next';

const props = defineProps<{
	image: string;
	title: string;
	lessons: number;
	practice: number;
	instructor: string;
	category: string;
	isOpen?: boolean | number;
	isRecommended?: boolean | number;
	isAssigned?: boolean | number;
	isShow?: boolean | number;
	learningPathCourses?: Array<{
		learningPath: {
			id: number;
			title: string;
		} | null;
	}>;
}>();

const imageSrc = computed(() => props.image || noImage);

const isOpen = computed(() => !!props.isOpen);
const isRecommended = computed(() => !!props.isRecommended);
const isAssigned = computed(() => !!props.isAssigned);
const isShow = computed(() => !!props.isShow);

</script>

<template>
	<Card
		class="!shadow-none border-1 border-surface-200 !rounded-xl h-full active:scale-90 transition-all hover:-translate-y-1 duration-200 transform"
		:class="{ 'grayscale opacity-75': !isOpen }"
	>
		<template #header>
			<div class="relative">
				<img :src="imageSrc" :alt="title" class="rounded-t-xl w-full object-cover aspect-video" />
				
				<!-- Recommended Badge -->
				<div v-if="isRecommended" class="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
					<StarIcon class="w-3 h-3" />
					RECOMMENDED
				</div>
				
				<!-- Public/Assigned Badge -->
				<div class="absolute top-2 left-2">
					<div v-if="isAssigned" class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
						<FlagIcon class="w-3 h-3" />
						ASSIGNED
					</div>
					<div v-else-if="isShow" class="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
						PUBLIC
					</div>
				</div>
			</div>
		</template>
		<template #title>
			<div class="flex justify-between mb-2 text-gray-500 text-sm">
				<span v-if="lessons">{{ lessons }} lessons</span>
				<span v-if="practice">{{ practice }} practices</span>
			</div>
			<h3 class="mt-3 font-bold text-xl">{{ title }}</h3>
		</template>
		<template #footer>
			<div class="flex justify-between items-center">
				<div>
					<span v-if="category"
						class="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full inline-block">{{ category }}</span>
				</div>
			</div>
			
			<!-- Learning Paths -->
			<div v-if="learningPathCourses && learningPathCourses.length > 0" class="mb-3">
				<div class="flex items-start gap-2">
					<GraduationCapIcon
						class="w-4 h-4 mt-0.5 flex-shrink-0" 
						:class="'text-blue-600'"
					/>
					<div class="flex flex-wrap gap-1">
						<span 
							v-for="lpc in learningPathCourses.filter(item => item.learningPath)" 
							:key="lpc.learningPath?.id"
							class="text-xs px-2 py-0.5 rounded-full inline-block"
							:class="'bg-blue-100 text-blue-800'"
						>
							{{ lpc.learningPath?.title }}
						</span>
					</div>
				</div>
			</div>
			<div class="flex justify-between items-center mt-2 pt-2 border-surface-200 border-t">
				<div class="text-gray-600 text-md">{{ instructor }}</div>
			</div>
		</template>
	</Card>
</template>

<style scoped>
:deep(.p-card-body) {
	height: 100%;
}

:deep(.p-card-content) {
	flex-grow: 1;
}
</style>