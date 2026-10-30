<script setup lang="ts">
const props = defineProps<{
    features: Array<{
        title: string;
        description: string;
        icon: any;
    }>
}>();
</script>

<template>
    <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
        <div class="text-center">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Powerful Learning Experience
            </div>
            <span class="text-muted-color text-2xl">Everything you need to master new skills and advance your career,
                all in one place.</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card v-for="(feature, idx) in props.features" :key="idx"
                class="flex flex-col items-center p-6 bg-white rounded-lg shadow">
                <template #title>
                    <div class="flex flex-col items-center">
                        <component :is="feature.icon" class="w-10 h-10 mb-4 text-blue-600" />
                        <p class="font-semibold text-lg mb-2">{{ feature.title }}</p>
                    </div>
                </template>

                <template #content>
                    <p class="text-gray-500 text-center">{{ feature.description }}</p>
                </template>
            </Card>
        </div>
    </div>
</template>
