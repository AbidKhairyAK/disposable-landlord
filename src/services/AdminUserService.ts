import useSWRV from "swrv"
import type { Ref } from "vue"

import type { AdminUser, AdminUserCreatePayload, AdminUserEditPayload, AdminUserList, AdminUserResetPasswordResponse } from "@/types/admin-user"

import fetcher from "./_fetcher"
import api from "./_api"

export function getUserList( page:Ref<number>, limit:Ref<number>, search:Ref<string>) {
	const params = () => {
		const searchParams = new URLSearchParams({
			page: String(page.value),
			limit: String(limit.value),
		})

		if (search?.value && search.value.trim().length > 2) {
			searchParams.append('search', search.value.trim())	
		}

		return searchParams.toString()
	}

	const url = () => "/admin/users?" + params()

	return useSWRV <AdminUserList> (url, fetcher)
}

export function getUserDetail( id:Ref ) {
	const url = () => id.value ? `/admin/users/${id.value}` : null
	return useSWRV <AdminUser> (url, fetcher, { revalidateOnFocus: false })
}

export function createUser( payload: AdminUserCreatePayload ) {
	const url = "/admin/users"
	return api.postForm <AdminUser> (url, payload)
}

export function editUser( payload: AdminUserEditPayload, id:string|number ) {
	const url = "/admin/users/" + id
	return api.putForm <AdminUser> (url, payload)
}

export function deleteUser( id:string|number ) {
	const url = "/admin/users/" + id
	return api.delete <AdminUser> (url)
}

export function resetUserPassword ( id:string|number ) {
	const url = `/admin/users/${id}/reset-password`
	return api.put <AdminUserResetPasswordResponse> (url)
}