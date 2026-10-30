<script setup>
import { useAuthStore } from '@/stores/auth-store';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppProfile from './AppProfile.vue';
import { AlignLeft, LogOut } from 'lucide-vue-next';
import Drawer from 'primevue/drawer';
import { logout } from '@/services/AuthService';
import { IButton } from '@/components';

const router = useRouter();
const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)

const navigateTo = (routeName) => {
  router.push({ name: routeName });
};

const visible = ref(false);

const handleLogout = async () => {
    try {
        await logout()
        router.push({ name: 'auth.login' })
    } catch (error) {
        console.error("Logout error:", error);
    }
}

const menuItems = ref([
    {
        label: 'Dashboard',
        command: () => router.push('/admin')
    },
]);

</script>

<template>
  <Drawer v-model:visible="visible">
    <div class="flex flex-col gap-4">
            <ul class="layout-menu">
                <li v-for="(item, index) in menuItems" :key="index" v-if="user">
                    <Button class="w-full !justify-start" severity="contrast" text @click="item.command">
                        <span>{{ item.label }}</span>
                    </Button>
                </li>
            </ul>
        </div>
    <template #footer v-if="user">
      <div class="border-t-1 border-surface-200 py-2">
            <IButton label="Logout" class="flex-auto" :lucide="LogOut" severity="danger" text @click="handleLogout"/>
        </div>
    </template>
  </Drawer>
  <nav class="bg-surface-0 border-b-1 border-surface-200 sticky top-0 z-40">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20 py-4">
        <!-- Hamburger button (mobile only) -->
        <div class="flex items-center md:hidden">
          <Button @click="visible = true" variant="text" severity="contrast">
            <AlignLeft />
          </Button>
        </div>

        <!-- Left side: Logo and Explore -->
        <div class="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 md:relative md:left-0 md:transform-none md:translate-x-0 md:top-0 md:translate-y-0 md:flex">
          <!-- Logo -->
          <RouterLink class="flex-shrink-0 flex items-center cursor-pointer" to="/">
            <img class="h-8 w-auto" src="/logo.png" alt="Udemy" />
          </RouterLink>
        </div>

        <!-- Right side: Menu items and user avatar -->
        <div class="flex items-center">
          <div class="flex-1 hidden md:flex space-x-1 h-full">
            <template v-if="user">
              <div class="relative">
                <Button label="Profile" severity="primary" variant="text" class="!px-4 h-full" v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-scalein',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-fadeout',
                  hideOnOutsideClick: true
                }">
                  <Avatar :label="user.name[0]" shape="circle"
                    class="!h-10 !w-10 !bg-primary-100 !text-primary-500 font-bold" />
                </Button>
                <AppProfile class="mt-3" />
              </div>
            </template>
            <template v-else>
              <Button label="Login" severity="primary" variant="outlined" v-on:click="navigateTo('auth.login')" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.custom-button:hover {
  color: var(--primary-color) !important;
}

.custom-button {
  color: var(--color-gray-900);
}
</style>
