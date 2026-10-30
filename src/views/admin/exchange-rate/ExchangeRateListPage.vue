<script setup lang="ts">
import type { DataTablePageEvent } from 'primevue/datatable'
import { computed, ref } from 'vue'
import { useDebounce } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { PlusIcon, FilePenIcon, Trash2Icon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { IButton, ICardHeader } from '@/components'
import { getTableRowNumber, formatDate } from '@/lib/utils'
import SearchBar from '@/components/SearchBar.vue'
import { getExchangeRateList, deleteExchangeRate } from '@/services/ExchangeRateService'

const page            = ref(1)
const limit           = ref(10)
const searchTerm      = ref('')
const debouncedSearch = useDebounce(searchTerm, 500)

const router  = useRouter()
const toast   = useToast()
const confirm = useConfirm()

const {
	data      : allRates,
	isLoading : isLoadingRates,
	mutate    : mutateRates,
} = getExchangeRateList(page, limit, debouncedSearch)

const rateData = computed(() => allRates.value?.data ?? [])
const rateMeta = computed(() => allRates.value?.meta)

function handlePageChange(event: DataTablePageEvent) {
	page.value  = event.page + 1
	limit.value = event.rows
}

function confirmDelete(id: number, label: string) {
	confirm.require({
		message: `Are you sure you want to delete the exchange rate "${label}"?`,
		header: 'Delete Confirmation',
		icon: 'pi pi-exclamation-triangle',
		rejectProps: { label: 'Cancel', severity: 'secondary' },
		acceptProps: { label: 'Delete', severity: 'danger' },
		accept: async () => {
			await deleteExchangeRate(id)
			mutateRates()
			toast.add({ severity: 'success', summary: 'Deleted', detail: 'Exchange rate has been deleted.', life: 3000 })
		},
	})
}
</script>

<template>
	<main>
		<ConfirmDialog />
		<Card>
			<template #title>
				<ICardHeader
					title="Exchange Rates"
					subtitle="Manage currency exchange rates."
				>
					<div class="flex flex-col items-start md:items-end gap-2 w-fit">
						<RouterLink to="/admin/exchange-rates/form">
							<IButton label="Add Rate" :lucide="PlusIcon" />
						</RouterLink>
						<SearchBar
							v-model="searchTerm"
							placeholder="Search by currency..."
						/>
					</div>
				</ICardHeader>
			</template>

			<template #content>
				<DataTable
					id="exchange-rate-table"
					class="border border-surface rounded-border overflow-hidden"
					lazy
					paginator
					:loading="isLoadingRates"
					:value="rateData"
					:rows="rateMeta?.perPage"
					:total-records="rateMeta?.total"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					@page="handlePageChange"
				>
					<template #empty> No data... </template>

					<Column header="No" body-class="w-[50px]">
						<template #body="{ index }">
							{{ getTableRowNumber(index, rateMeta?.currentPage!, rateMeta?.perPage!) }}
						</template>
					</Column>

					<Column field="from_currency" header="From">
						<template #body="{ data }">
							{{ data.fromCurrency }}
						</template>
					</Column>

					<Column field="to_currency" header="To">
						<template #body="{ data }">
							{{ data.toCurrency }}
						</template>
					</Column>

					<Column field="rate" header="Rate">
						<template #body="{ data }">
							{{ data.rate.toLocaleString() }}
						</template>
					</Column>

					<Column field="updatedAt" header="Last Updated">
						<template #body="{ data }">
							{{ formatDate(data.updatedAt) }}
						</template>
					</Column>

					<Column header="Action" body-class="w-[160px]">
						<template #body="{ data }">
							<section class="flex gap-2">
								<IButton
									label="Edit"
									size="small"
									severity="secondary"
									:lucide="FilePenIcon"
									@click="router.push(`/admin/exchange-rates/form/${data.id}`)"
								/>
								<IButton
									label="Delete"
									size="small"
									severity="secondary"
									:lucide="Trash2Icon"
									@click="confirmDelete(data.id, `${data.fromCurrency} → ${data.toCurrency}`)"
								/>
							</section>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</main>
</template>
