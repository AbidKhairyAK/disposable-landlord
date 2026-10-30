<script setup lang="ts">
import { FilePenIcon, ListIcon, PlusIcon, Trash2Icon } from 'lucide-vue-next'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

import { IButton, ICardHeader } from '@/components'
import { getTableRowNumber } from '@/lib/utils'
import { useConfirm } from 'primevue/useconfirm'
import { useDebounce } from '@vueuse/core'
import SearchBar from '@/components/SearchBar.vue'
import { getTenantList, deleteTenant } from '@/services/AdminTenantService'

const page 			= ref(1)
const limit			= ref(10)
const searchTerm 	= ref('')
const deletingId	= ref(0)
const router		= useRouter()
const toast			= useToast()
const confirm 		= useConfirm()
const debouncedSearch= useDebounce(searchTerm, 500)
const rootDomain = import.meta.env.VITE_API_ROOT_DOMAIN

const {
	data		: allTenant,
	isLoading	: isLoadingTenant,
	mutate		: mutateTenant
} = getTenantList( page, limit, debouncedSearch)

const tenantList = computed(() => allTenant.value)

function handlePageChange ( event:DataTablePageEvent ) {
	page.value	= event.page+1
	limit.value	= event.rows
}

function handleEdit( id:number ) {
	router.push('/admin/tenants/form/' + id)
}

function handleDetail( id:number ) {
	router.push('/admin/tenants/detail/' + id)
}

async function handleDelete( id:number ) {	
	try {
		deletingId.value = Number(id)
		await deleteTenant(id)
		toast.add({ severity: 'success', summary: 'Delete Success', detail: 'Tenant has been deleted successfully.', life: 3000 });
		mutateTenant()
	} catch (err) {
		toast.add({ severity: 'error', summary: 'Delete Failed', detail: 'Failed to delete tenant.', life: 3000 });
	} finally {
		deletingId.value = 0
	}
}

function confirmDelete ( id:number ) {
	confirm.require({
		message: 'Are you sure you want to delete this tenant?',
		header: 'Confirmation',

		rejectProps: {
			label: 'Cancel',
			severity: 'secondary',
			outlined: true,
		},

		acceptProps: {
			label: 'Delete',
			severity: 'danger',
		},

		accept: () => handleDelete(id)
	})
}
</script>

<template>
	<main>
		<Card>
			<template #title>
				<ICardHeader
					title="Tenant List"
					subtitle="List of available tenants on this platform."
				>
					<div class="flex flex-col items-start md:items-end gap-2 w-fit">
						<RouterLink to="/admin/tenants/form">
							<IButton label="Create Tenant" :lucide="PlusIcon" />
						</RouterLink>
						
						<SearchBar 
							v-model="searchTerm" 
							placeholder="Search tenant by name..."
						/>
					</div>
				</ICardHeader>
			</template>

			<template #content>
				<div class="mb-4">
				</div>

				<DataTable 
					id="tenant-table" 
					class="border border-surface rounded-border overflow-hidden"
					lazy
					paginator
					:loading="isLoadingTenant"
					:value="tenantList?.data"
					:rows="tenantList?.meta.perPage"
					:total-records="tenantList?.meta.total"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					@page="handlePageChange"
				>
					<template #empty> No data... </template>

					<Column header="No" body-class="w-[50px]">
						<template #body="{ index }">
							{{ getTableRowNumber(index, tenantList?.meta.currentPage!, tenantList?.meta.perPage!) }}
						</template>
					</Column>

					<Column field="name" header="Tenant Name">
						<template #body="{ data }">
							{{ data.name }}
						</template>
					</Column>

					<Column field="tenantIdentifier" header="Subdomain">
						<template #body="{ data }">
							<Button 
								as="a"
								severity="link"
								:label="data.tenantIdentifier + '.' + rootDomain" 
								:href="'https://' + data.tenantIdentifier + '.' + rootDomain" 
								target="_blank" 
								rel="noopener"
								class="px-0!"
							/>
						</template>
					</Column>

					<Column field="isActive" header="Status">
						<template #body="{ data }">
							<section class="flex gap-2">
								<Tag v-if="data.isActive" severity="info" value="active"></Tag>
								<Tag v-else severity="secondary" value="inactive"></Tag>
								<!-- <Tag v-if="data.isMaintenance" severity="warning" value="maintenance"></Tag>
								<Tag v-else severity="info" value="online"></Tag> -->
								<Tag v-if="data.isAiEnabled" severity="success" value="AI on"></Tag>
								<Tag v-else severity="secondary" value="AI off"></Tag>
							</section>
						</template>
					</Column>

					<Column header="Action" body-class="w-[200px]">
						<template #body="{ data }">
							<section class="flex gap-2">
								<IButton 
									label="Detail" 
									size="small" 
									severity="secondary" 
									:lucide="ListIcon"
									@click="handleDetail(data.id)" 
								/>
								<IButton 
									label="Edit" 
									size="small" 
									severity="secondary" 
									:lucide="FilePenIcon"
									@click="handleEdit(data.id)" 
								/>
								<IButton 
									label="Delete" 
									size="small" 
									severity="secondary" 
									:lucide="Trash2Icon"
									:loading="deletingId === data.id"
									@click="confirmDelete(data.id)"
								/>
							</section>
						</template>
					</Column>
				</DataTable>

			</template>
		</Card>

	</main>
</template>
