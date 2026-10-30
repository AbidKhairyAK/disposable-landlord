import type { Component } from 'vue'
import type { RoleEnum } from './user'

export interface MenuItem {
	label: string
	icon?: Component
	to?: string
	items?: MenuItem[]
	separator?: boolean
	required_roles?: RoleEnum[]
	section?: 'tenant' | 'course' | 'user' | 'learning' | 'studio' | 'other' // For organizing menus
	order?: number // For ordering menus within a section
}

export interface MenuGroup {
	label: string
	items: MenuItem[]
	required_roles?: RoleEnum[]
}
