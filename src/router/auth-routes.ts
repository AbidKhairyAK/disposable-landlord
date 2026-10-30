import type { RouteRecordRaw } from "vue-router";

const auth_routes: RouteRecordRaw[] = [
	{ path: '',	 		name: 'auth.empty', 	redirect: { name: 'auth.login' } },
	{ path: 'login',	name: 'auth.login',		component: () => import('@/views/auth/LoginPage.vue')},
	{ path: 'access-denied', name: 'auth.access_denied', component: () => import('@/views/error/AccessDeniedPage.vue'), meta: { bypass_guest: true }},
]

export default auth_routes
