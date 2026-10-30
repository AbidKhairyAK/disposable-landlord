<script setup>
import { useLayout } from '@/layouts/_composables/layout';
import { ChevronDown } from 'lucide-vue-next';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';


const auth = useAuthStore()
const route = useRoute();

const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? props.parentItemKey + '-' + props.index : String(props.index);

    const activeItem = layoutState.activeMenuItem;

    isActiveMenu.value = activeItem === itemKey.value || activeItem ? activeItem.startsWith(itemKey.value + '-') : false;
});

watch(
    () => layoutState.activeMenuItem,
    (newVal) => {
        isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
    }
);

function itemClick(event, item) {
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    if ((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)) {
        toggleMenu();
    }

    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value;

    setActiveMenuItem(foundItemKey);
}

function checkActiveRoute(item) {
    return route.path === item.to;
}

function checkRequiredRoles(item) {
    return item.required_roles ? item.required_roles.includes(auth.user?.role) : true
}
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <div v-if="root && item.visible !== false && checkRequiredRoles(item)" class="layout-menuitem-root-text">{{ item.label }}</div>
        <a v-if="(!item.to || item.items) && item.visible !== false && checkRequiredRoles(item)" :href="item.url" @click="itemClick($event, item, index)" :class="item.class" :target="item.target" tabindex="0">
            <component :is="item.icon" class="layout-menuitem-icon w-5 h-5 text-primary"/>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <component :is="ChevronDown" class="layout-submenu-toggler w-5 h-5" v-if="item.items"/>
        </a>
        <router-link v-if="item.to && !item.items && item.visible !== false && checkRequiredRoles(item)" @click="itemClick($event, item, index)" :class="[item.class, { 'active-route': checkActiveRoute(item), 'pointer-events-none opacity-60 cursor-default': checkActiveRoute(item) }]" :tabindex="checkActiveRoute(item) ? -1 : 0" :to="item.to">
            <component :is="item.icon" class="layout-menuitem-icon w-5 h-5 text-primary" />
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <component :is="ChevronDown" class="layout-submenu-toggler w-5 h-5" v-if="item.items"/>
        </router-link>
        <Transition v-if="item.items && item.visible !== false && checkRequiredRoles(item)" name="layout-submenu">
            <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :parentItemKey="itemKey" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped></style>
