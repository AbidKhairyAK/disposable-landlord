import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/auth-store'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { RoleEnum } from '@/types/user'
import { getProfile } from '@/services/AuthService'

import auth_routes from './auth-routes'
import admin_routes from './admin-routes'
import { startRouteLoading, stopRouteLoading } from './utils/navigation-loading'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', redirect: '/admin' },
		{ path: '/auth', name: 'auth', component: AuthLayout, children: auth_routes, meta: { guest: true } },
		{ path: '/admin', name: 'admin', component: AdminLayout, children: admin_routes, meta: { requires_auth: true, required_roles: [RoleEnum.admin] } },
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		}

		if (to.hash) {
			return { el: to.hash }
		}

		return { top: 0, left: 0 }
	}
})

router.beforeEach(async (to, from, next) => {
	startRouteLoading()

	const authStore = useAuthStore()

	if (!authStore.sessionInitialized) {
		try {
			await getProfile()
		} catch {
			authStore.markSessionInitialized()
		}
	}

	if (to.meta.guest && authStore.isAuthenticated && !to.meta.bypass_guest) {
		if (authStore.user?.role === RoleEnum.admin) {
			next({ name: 'admin.home' })
		} else {
			next({ name: 'auth.access_denied' })
		}
		return
	}

	if (to.meta.requires_auth && !authStore.isAuthenticated) {
		next({ name: 'auth.login', query: { redirect: to.fullPath } })
		return
	}

	if (to.meta.required_roles) {
		const requiredRoles = to.meta.required_roles as string[]
		const userRole = authStore.user?.role || RoleEnum.student
		const hasRequiredRole = requiredRoles.includes(userRole)

		if (!hasRequiredRole) {
			next({ name: 'auth.access_denied' })
			return
		}
	}

	next()
})

router.afterEach(() => {
	stopRouteLoading()
})

router.onError((error) => {
	stopRouteLoading()

	const chunkFailedMessage = /Failed to fetch dynamically imported module|Loading chunk [\d]+ failed/

	if (chunkFailedMessage.test(error.message)) {
		const isReloaded = sessionStorage.getItem('chunk-load-failed-reloaded')

		if (!isReloaded) {
			sessionStorage.setItem('chunk-load-failed-reloaded', 'true')
			window.location.reload()
		} else {
			setTimeout(() => {
				sessionStorage.removeItem('chunk-load-failed-reloaded')
			}, 1000)
		}
	}
})

export default router
