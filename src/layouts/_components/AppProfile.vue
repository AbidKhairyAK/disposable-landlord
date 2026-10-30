<script setup>
import { LogOut } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';
import { logout } from '@/services/AuthService';
import { useLayout } from '@/layouts/_composables/layout';

const { isDarkTheme } = useLayout();

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.currentUser)

const menuItems = ref([
    {
        label: 'Logout',
        icon: LogOut,
        role: ['admin'],
        command: () => handleLogout()
    }
]);

const handleLogout = async () => {
    try {
        await logout()
        router.push({ name: 'auth.login' })
    } catch (error) {
        console.error("Logout error:", error);
    }
}
</script>

<template>
    <div
        :class="['config-panel hidden absolute top-[3.25rem] right-0 w-64 p-4 border rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]', isDarkTheme ? 'bg-surface-900 border-surface-700' : 'bg-surface-0 border-surface']">
        <div class="flex flex-col gap-4">
            <!-- User Role Header -->
            <div v-if="user?.role" class="px-3 py-2 border-b border-surface-200">
                <p class="text-sm font-medium capitalize">{{ user?.role }}</p>
            </div>
            
            <ul class="layout-menu -mt-2">
                <template v-for="(item, index) in menuItems" :key="index">
                    <li v-if="user && item.role.includes(user.role)">
                        <button
                            class="flex items-center w-full p-2 text-left hover:bg-surface-100 rounded-lg transition-colors"
                            @click="item.command">
                            <component :is="item.icon" class="w-5 h-5 mr-2" />
                            <span>{{ item.label }}</span>
                        </button>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
