<script setup lang="ts">
import type { DataTablePageEvent } from 'primevue/datatable'
import { computed, ref } from 'vue'
import { useDebounce } from '@vueuse/core'

import { ICardHeader } from '@/components'
import { getTableRowNumber, formatDate } from '@/lib/utils'
import SearchBar from '@/components/SearchBar.vue'
import { getCoinRemainingList } from '@/services/CoinRemainingService'

const page            = ref(1)
const limit           = ref(10)
const searchTerm      = ref('')
const debouncedSearch = useDebounce(searchTerm, 500)

const {
	data      : allRemainings,
	isLoading : isLoadingRemainings,
} = getCoinRemainingList(page, limit, debouncedSearch)

const remainingData = computed(() => allRemainings.value?.data ?? [])
const remainingMeta = computed(() => allRemainings.value?.meta)

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
					title="Coin Remaining"
					subtitle="Current coin balance for each tenant."
				>
					<SearchBar
						v-model="searchTerm"
						placeholder="Search by tenant..."
					/>
				</ICardHeader>
			</template>

			<template #content>
				<DataTable
					id="coin-remaining-table"
					class="border border-surface rounded-border overflow-hidden"
					lazy
					paginator
					:loading="isLoadingRemainings"
					:value="remainingData"
					:rows="remainingMeta?.perPage"
					:total-records="remainingMeta?.total"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					@page="handlePageChange"
				>
					<template #empty> No data... </template>

					<Column header="No" body-class="w-[50px]">
						<template #body="{ index }">
							{{ getTableRowNumber(index, remainingMeta?.currentPage!, remainingMeta?.perPage!) }}
						</template>
					</Column>

					<Column field="tenantName" header="Tenant Name">
						<template #body="{ data }">
							{{ data.tenantName }}
						</template>
					</Column>

					<Column field="amount" header="Remaining Balance">
						<template #body="{ data }">
							{{ data.amount.toLocaleString() }}
						</template>
					</Column>

					<Column field="updatedAt" header="Last Updated">
						<template #body="{ data }">
							{{ formatDate(data.updatedAt) }}
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</main>
</template>
