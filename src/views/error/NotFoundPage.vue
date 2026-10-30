<template>
	<div class="flex items-center justify-center min-h-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div class="rounded-[56px] p-[0.3rem] bg-gradient-custom">
                <div class="w-full bg-surface-0 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                    <span class="text-primary font-bold text-3xl">404</span>
                    <h1 class="text-surface-900 font-bold text-3xl lg:text-5xl mb-2">Not Found</h1>
                    <div class="text-surface-600 mb-8">Requested resource is not available.</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
  .bg-gradient-custom {
    background: linear-gradient(180deg, var(--primary-color) 10%, var(--surface-ground) 30%, var(--surface-ground) 70%, var(--primary-color) 90%);
  }
</style>