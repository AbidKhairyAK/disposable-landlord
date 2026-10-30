import useSWRV from "swrv"
import type { Ref } from "vue"

import fetcher from "./_fetcher"
import api from "./_api"

import type {
  AdminTenantList,
  AdminTenantCatalog,
  AdminTenant,
  AdminTenantCreatePayload,
} from "@/types/admin-tenant"

export function getTenantList( page:Ref<number>, limit:Ref<number>, search:Ref<string>) {
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

	const url = () => "/landlord/tenants?" + params()

	return useSWRV <AdminTenantList> (url, fetcher)
}

export function getTenantDetail( id:Ref ) {
	const url = () => id.value ? `/landlord/tenants/${id.value}` : null
	return useSWRV <AdminTenant> (url, fetcher, { revalidateOnFocus: false })
}

export function getTenantCatalogOptions() {
	const url = "/landlord/tenants?page=1&limit=1&includeCatalog=true"
	return useSWRV<{ catalog: AdminTenantCatalog }>(url, fetcher, { revalidateOnFocus: false })
}

export function createTenant( payload: AdminTenantCreatePayload ) {
	const url = "/landlord/tenants"
	return api.post <AdminTenant> (url, payload)
}

export function editTenant( payload: AdminTenantCreatePayload, id: number ) {
	const url = "/landlord/tenants/" + id
	return api.put <AdminTenant> (url, payload)
}

export function deleteTenant( id:string|number ) {
	const url = "/landlord/tenants/" + id
	return api.delete <AdminTenant> (url)
}
