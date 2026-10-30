<script setup>
import { Lock } from 'lucide-vue-next';

</script>

<template>
    <div class="flex items-center justify-center min-h-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div class="rounded-[56px] p-[0.3rem] bg-gradient-custom">
                <div class="w-full bg-surface-0 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                    <div class="gap-4 flex flex-col items-center">
                        <div class="flex justify-center items-center border-2 border-orange-500 rounded-full h-12 w-12">
                            <component :is="Lock" class="w-7 h-7 text-orange-500"/>
                        </div>
                        <h1 class="text-surface-900 font-bold text-4xl lg:text-5xl mb-2">Access Denied</h1>
                        <span class="text-muted-color mb-8">You do not have the necessary permisions. Please contact admins.</span>
                        <img src="@/assets/images/asset-access.svg" alt="Access denied" class="mb-8" width="80%" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
  .bg-gradient-custom {
    background: linear-gradient(180deg, var(--color-red-500) 10%, var(--surface-ground) 30%, var(--surface-ground) 70%, var(--color-red-500) 90%);
  }
</style>
