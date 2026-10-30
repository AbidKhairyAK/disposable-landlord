<script setup lang="ts">
import { FilePenIcon, InfoIcon, PlusIcon, Search, Trash2Icon, X } from 'lucide-vue-next'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

import { deleteUser, getUserList } from '@/services/AdminUserService'
import { IButton, ICardHeader } from '@/components'
import { getTableRowNumber } from '@/lib/utils'
import { useConfirm } from 'primevue/useconfirm'
import { useDebounce } from '@vueuse/core'
import SearchBar from '@/components/SearchBar.vue'

const page 			= ref(1)
const limit			= ref(10)
const searchTerm 	= ref('')
const deletingId	= ref(0)
const router		= useRouter()
const toast			= useToast()
const confirm 		= useConfirm()
const debouncedSearch= useDebounce(searchTerm, 500)

const {
	data		: allUser,
	isLoading	: isLoadingUser,
	mutate		: mutateUser
} = getUserList( page, limit, debouncedSearch)

const userList = computed(() => allUser.value)

function handlePageChange ( event:DataTablePageEvent ) {
	page.value	= event.page+1
	limit.value	= event.rows
}

function handleEdit( id:number ) {
	router.push('/admin/users/form/' + id)
}

function handleDetail( id:number ) {
	router.push('/admin/users/detail/' + id)
}

async function handleDelete( id:number ) {	
	try {
		deletingId.value = Number(id)
		await deleteUser(id)
		await mutateUser()
		toast.add({ severity: 'success', summary: 'Delete Success', life: 3000 });
	} catch (err) {
		toast.add({ severity: 'error', summary: 'Delete Failed', life: 3000 });
	} finally {
		deletingId.value = 0
	}
}

function confirmDelete ( id:number ) {
	confirm.require({
		message: 'Are you sure you want to delete the user?',
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

const handleClearSearch = async () => {
  searchTerm.value = ''
  page.value = 1
  await mutateUser()
}

const handleSearchClick = async () => {
  page.value = 1
  await mutateUser()
}
</script>

<template>
	<main>
		<Card>
			<template #title>
				<ICardHeader
					title="User List"
					subtitle="List of available user on this platform."
				>
					<div class="w-fit flex flex-col items-start gap-2 md:items-end">
						<RouterLink to="/admin/users/form">
							<IButton label="Create User" :lucide="PlusIcon" />
						</RouterLink>

						<SearchBar v-model="searchTerm" placeholder="Search name, role, or email" 
							@search="handleSearchClick" @clear="handleClearSearch"
							container-class="flex gap-2 md:min-w-lg"
						/>
					</div>
				</ICardHeader>
			</template>

			<template #content>
				<DataTable 
					id="my-table" 
					class="border border-surface rounded-border	overflow-hidden"
					lazy
					paginator
					:loading="isLoadingUser"
					:value="userList?.data" 
					:rows="userList?.meta.perPage"
					:total-records="userList?.meta.total"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					@page="handlePageChange"
				>
					<template #empty> No data... </template>

					<Column header="ID" body-class="w-[50px]">
						<template #body="{ index }">
							{{ getTableRowNumber(index, userList?.meta.currentPage!, userList?.meta.perPage!) }}
						</template>
					</Column>

					<Column field="name" header="Name" />

					<Column field="role" header="Role" />

					<Column field="email" header="Email" />

					<Column header="Action" body-class="w-[260px]">
						<template #body="{ data }">
							<section class="flex gap-2">
								<IButton 
									label="Detail" 
									size="small" 
									severity="secondary" 
									:lucide="InfoIcon"
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