<script setup lang="ts">
import type { DataTablePageEvent } from 'primevue/datatable'
import { computed, ref } from 'vue'
import { useDebounce } from '@vueuse/core'

import { ICardHeader } from '@/components'
import { getTableRowNumber, formatDate } from '@/lib/utils'
import SearchBar from '@/components/SearchBar.vue'
import { getCoinUsageList } from '@/services/CoinUsageService'

const page            = ref(1)
const limit           = ref(10)
const searchTerm      = ref('')
const debouncedSearch = useDebounce(searchTerm, 500)

const {
	data      : allUsages,
	isLoading : isLoadingUsages,
} = getCoinUsageList(page, limit, debouncedSearch)

const usageData = computed(() => allUsages.value?.data ?? [])
const usageMeta = computed(() => allUsages.value?.meta)

function handlePageChange(event: DataTablePageEvent) {
	page.value  = event.page + 1
	limit.value = event.rows
}
</script>

<template>
	<main>
		<Card>
			<template #title>
				<ICardHeader
					title="Coin Usage"
					subtitle="List of all coin usage records."
				>
					<SearchBar
						v-model="searchTerm"
						placeholder="Search by tenant..."
					/>
				</ICardHeader>
			</template>

			<template #content>
				<DataTable
					id="coin-usage-table"
					class="border border-surface rounded-border overflow-hidden"
					lazy
					paginator
					:loading="isLoadingUsages"
					:value="usageData"
					:rows="usageMeta?.perPage"
					:total-records="usageMeta?.total"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					@page="handlePageChange"
				>
					<template #empty> No data... </template>

					<Column header="No" body-class="w-[50px]">
						<template #body="{ index }">
							{{ getTableRowNumber(index, usageMeta?.currentPage!, usageMeta?.perPage!) }}
						</template>
					</Column>

					<Column field="tenant_name" header="Tenant Name">
						<template #body="{ data }">
							{{ data.tenantName }}
						</template>
					</Column>

					<Column field="type" header="Type">
						<template #body="{ data }">
							{{ data.type ?? '-' }}
						</template>
					</Column>

					<Column field="model" header="Model">
						<template #body="{ data }">
							{{ data.model ?? '-' }}
						</template>
					</Column>

					<Column field="input_quantity" header="Input">
						<template #body="{ data }">
							{{ data.inputQuantity != null ? `${data.inputQuantity.toLocaleString()} ${data.unit ?? ''}`.trim() : '-' }}
						</template>
					</Column>

					<Column field="output_quantity" header="Output">
						<template #body="{ data }">
							{{ data.outputQuantity != null ? `${data.outputQuantity.toLocaleString()} ${data.unit ?? ''}`.trim() : '-' }}
						</template>
					</Column>

					<Column field="cost" header="Cost">
						<template #body="{ data }">
							{{ data.cost != null ? `${data.cost} ${data.currency ?? ''}` : '-' }}
						</template>
					</Column>

					<Column field="coinsUsed" header="Coins Used">
						<template #body="{ data }">
							{{ data.coinsUsed != null ? data.coinsUsed.toLocaleString() : '-' }}
						</template>
					</Column>

					<Column field="createdAt" header="Created At">
						<template #body="{ data }">
							{{ formatDate(data.createdAt) }}
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</main>
</template>
