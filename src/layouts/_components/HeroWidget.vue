<template>
    <div
        id="hero"
        class="flex flex-col px-6 lg:px-20 overflow-hidden"
        style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
    >
        <div class="mx-6 md:mx-20 mt-0 md:mt-6">
            <h1 class="text-6xl font-bold text-gray-900 leading-tight"><span class="font-light block">upgrade your skills</span>start your journey with Prodemy</h1>
            <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">Learn at your own pace - no hastle</p>
            <Button label="Get Started" as="router-link" to="/courses" rounded class="!text-xl mt-8 !px-4 transition-all! active:scale-90"></Button>
        </div>
        <div class="flex justify-center md:justify-end">
            <img src="/images/landing/hero-img.svg" alt="Hero Image" class="w-9/12 md:w-1/3" />
        </div>
    </div>
</template>