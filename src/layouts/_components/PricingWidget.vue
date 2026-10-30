<script setup lang="ts">
const props = defineProps<{
    courses: any,
    isLoading: boolean
}>();
</script>

<template>
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
        <div class="text-center mb-6">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Featured Courses</div>
            <span class="text-muted-color text-2xl">Kickstart your learning with our curated courses.</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <template v-if="props.isLoading">
                <div v-for="n in 6" :key="n">
                    <Skeleton height="20rem" class="rounded-xl" />
                </div>
            </template>
            <template v-else>
                <div v-for="course in props.courses?.data" :key="course.id" class="mb-4">
                    <RouterLink :to="{ name: 'public.course.detail', params: { slug: course.slug } }">
                        <ICardCourse :image="course?.imageUrl ?? ''" :title="course.title"
                            :instructor="course.instructor?.user?.name ?? ''" :lessons="course.lesson_count"
                            :practice="course.practice_count" />
                    </RouterLink>
                </div>
            </template>
        </div>
    </div>
</template>
