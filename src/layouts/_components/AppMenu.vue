<script setup>
import { computed } from "vue";
import { RoleEnum } from "@/types/user";

import AppMenuItem from "./AppMenuItem.vue";
import {
  Building2Icon,
  Album,
  ArrowLeftRightIcon,
  CpuIcon,
} from "lucide-vue-next";

const tenantName = 'Landlord'

const model = computed(() => [
  {
    label: tenantName,
    items: [
      { label: "Dashboard", icon: Album, to: "/admin", required_roles: [RoleEnum.admin] },
    ],
  },
  
  {
    label: "Tenant Management",
    items: [
      {
        label: "Tenants",
        icon: Building2Icon,
        to: "/admin/tenants",
        required_roles: [RoleEnum.admin],
      },
    ],
  },

  {
    label: "Finance",
    items: [
      {
        label: "Exchange Rates",
        icon: ArrowLeftRightIcon,
        to: "/admin/exchange-rates",
        required_roles: [RoleEnum.admin],
      },
      {
        label: "Model Pricing",
        icon: CpuIcon,
        to: "/admin/model-pricings",
        required_roles: [RoleEnum.admin],
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <div v-if="i != 0" class="mt-2 border-gray-200 border-t">
        
      </div>
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
</style>
