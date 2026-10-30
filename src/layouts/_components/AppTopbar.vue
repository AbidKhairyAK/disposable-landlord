<script setup>
import { useLayout } from '@/layouts/_composables/layout';
import { MenuIcon, Sun, Moon, PaletteIcon, UserIcon } from 'lucide-vue-next';
import { computed } from 'vue';
import AppConfigurator from './AppConfigurator.vue';
import AppProfile from './AppProfile.vue';
import { useAuthStore } from '@/stores/auth-store';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const darkModeIcon = computed(() => isDarkTheme.value ? Moon : Sun);

const authStore = useAuthStore();
const userEmail = computed(() => authStore.currentUser?.email || 'User');

const logoUrl = '/logo.png'
const tenantName = 'Landlord'

</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <MenuIcon class="w-8 h-8" />
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img :src="logoUrl" alt="logo" class="w-auto h-9" />
                <span>{{ tenantName }}</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="!gap-12 layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <component :is="darkModeIcon" class="w-6 h-6" />
                </button>

                <!-- Hide theme switcher for now, since it has some issues with the layout, will be fixed in the future update -->
                 
                <!-- <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <PaletteIcon class="w-6 h-6"/>
                    </button>
                    <AppConfigurator />
                </div> -->
                <div class="relative">
                    <div class="flex items-center gap-4">
                        <div class="text-xl">
                            {{ userEmail }}
                        </div>
                        <button type="button" class="layout-topbar-action"  
                        v-styleclass="{ 
                            selector: '@next', 
                            enterFromClass: 'hidden', 
                            enterActiveClass: 'animate-scalein', 
                            leaveToClass: 'hidden', 
                            leaveActiveClass: 'animate-fadeout', 
                            hideOnOutsideClick: true 
                        }">
                            <UserIcon class="w-6 h-6"/>
                        </button>
                        <AppProfile />
                    </div>
                </div>
            </div>

            <div class="hidden lg:block layout-topbar-menu">
                
            </div>
        </div>
    </div>
</template>
