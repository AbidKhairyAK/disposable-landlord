<script setup>
import { RouterView } from 'vue-router';
import FooterWidget from './_components/FooterWidget.vue';
import NavbarWidget from './_components/NavbarWidget.vue';
import NavigationBar from '@/views/public/components/NavigationBar.vue';
import FooterSection from '@/views/public/components/FooterSection.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col">
      <NavigationBar />
      <main class="flex-grow bg-white">
        <RouterView></RouterView>
      </main>
      <FooterSection />
    </div>
  </template>
