import { RoleEnum } from "@/types/user";
import type { RouteRecordRaw } from "vue-router";

const admin_routes: RouteRecordRaw[] = [
  {
    path: "",
    name: "admin.home",
    component: () => import("@/views/admin/home/Home.vue"),
  },

  {
    path: "tenants",
    name: "admin.tenants.list",
    component: () => import("@/views/admin/tenant/TenantListPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },
  {
    path: "tenants/form",
    name: "admin.tenants.create",
    component: () => import("@/views/admin/tenant/TenantFormPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },
  {
    path: "tenants/form/:tenantId",
    name: "admin.tenants.edit",
    component: () => import("@/views/admin/tenant/TenantFormPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },
  {
    path: "tenants/detail/:tenantId",
    name: "admin.tenants.detail",
    component: () => import("@/views/admin/tenant/TenantDetailPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },

  {
    path: "exchange-rates",
    name: "admin.exchange-rates.list",
    component: () => import("@/views/admin/exchange-rate/ExchangeRateListPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },
  {
    path: "exchange-rates/form",
    name: "admin.exchange-rates.create",
    component: () => import("@/views/admin/exchange-rate/ExchangeRateFormPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },
  {
    path: "exchange-rates/form/:id",
    name: "admin.exchange-rates.edit",
    component: () => import("@/views/admin/exchange-rate/ExchangeRateFormPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },

  {
    path: "model-pricings",
    name: "admin.model-pricings.list",
    component: () => import("@/views/admin/model-pricing/ModelPricingListPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },
  {
    path: "model-pricings/form",
    name: "admin.model-pricings.create",
    component: () => import("@/views/admin/model-pricing/ModelPricingFormPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },
  {
    path: "model-pricings/form/:id",
    name: "admin.model-pricings.edit",
    component: () => import("@/views/admin/model-pricing/ModelPricingFormPage.vue"),
    meta: { required_roles: [RoleEnum.admin] },
  },
];

export default admin_routes;
