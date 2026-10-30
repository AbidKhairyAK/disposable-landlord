<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import noImage from '@/assets/images/noimage.jpg';
import { LockIcon, StarIcon, BookOpenIcon, GraduationCapIcon } from 'lucide-vue-next';

const props = defineProps<{
	image: string;
	title: string;
	description?: string;
	courses: number;
	id: number;
	isOpen?: boolean;
	isRecommended?: boolean;
	isAssigned?: boolean | number;
	isShow?: boolean | number;
}>();

const isAssigned = computed(() => !!props.isAssigned);
const isShow = computed(() => !!props.isShow);

const router = useRouter();
const imageSrc = computed(() => props.image || noImage);

const navigateToDetail = () => {
	router.push({
		name: 'public.learning_path.detail',
		params: { id: props.id }
	});
};
</script>

<template>
	<Card
		class="!shadow-none border-2 border-blue-100 !rounded-2xl h-full active:scale-95 transition-all hover:-translate-y-2 hover:shadow-lg duration-200 transform overflow-hidden cursor-pointer"
		:class="{ 'grayscale opacity-75': !isOpen }"
		@click="navigateToDetail"
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
						<LockIcon class="w-3 h-3" />
						ASSIGNED
					</div>
					<div v-else-if="isShow" class="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
						PUBLIC
					</div>
				</div>
			</div>
		</template>
		<template #title>
			<h3 class="font-bold text-xl line-clamp-2 text-gray-800 mb-2">{{ title }}</h3>
			<p v-if="description" class="text-gray-600 text-sm line-clamp-2 mb-3">{{ description }}</p>
		</template>
		<template #content>
			<!-- Stats Section -->
			<div class="bg-blue-50 rounded-lg p-3">
				<div class="flex items-center gap-2 text-blue-700">
					<div class="bg-blue-100 p-1.5 rounded-md">
						<BookOpenIcon class="w-4 h-4" />
					</div>
					<span class="font-semibold text-sm">{{ courses }} Courses</span>
				</div>
			</div>
		</template>
	</Card>
</template>

<style scoped>
:deep(.p-card-body) {
	height: 100%;
	display: flex;
	flex-direction: column;
}

:deep(.p-card-content) {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

:deep(.p-card-title) {
	margin-bottom: 0;
}
</style>
