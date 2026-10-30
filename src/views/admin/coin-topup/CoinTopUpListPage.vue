<script setup lang="ts">
import type { DataTablePageEvent } from 'primevue/datatable'
import { computed, ref } from 'vue'
import { useDebounce } from '@vueuse/core'

import { PlusIcon } from 'lucide-vue-next'
import { IButton, ICardHeader } from '@/components'
import { getTableRowNumber, formatDate } from '@/lib/utils'
import SearchBar from '@/components/SearchBar.vue'
import { getCoinTopUpList } from '@/services/CoinTopUpService'

const page         = ref(1)
const limit        = ref(10)
const searchTerm   = ref('')
const debouncedSearch = useDebounce(searchTerm, 500)

const {
	data      : allTopUps,
	isLoading : isLoadingTopUps,
} = getCoinTopUpList(page, limit, debouncedSearch)

const topUpData = computed(() => allTopUps.value?.data ?? [])
const topUpMeta = computed(() => allTopUps.value?.meta)

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
					title="Coin Top Up"
					subtitle="List of all coin top-up transactions."
				>
					<div class="flex flex-col items-start md:items-end gap-2 w-fit">
						<RouterLink to="/admin/coin-top-ups/form">
							<IButton label="Create Top Up" :lucide="PlusIcon" />
						</RouterLink>
						<SearchBar
							v-model="searchTerm"
							placeholder="Search by tenant..."
						/>
					</div>
				</ICardHeader>
			</template>

			<template #content>
				<DataTable
					id="coin-topup-table"
					class="border border-surface rounded-border overflow-hidden"
					lazy
					paginator
					:loading="isLoadingTopUps"
					:value="topUpData"
					:rows="topUpMeta?.perPage"
					:total-records="topUpMeta?.total"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					@page="handlePageChange"
				>
					<template #empty> No data... </template>

					<Column header="No" body-class="w-[50px]">
						<template #body="{ index }">
							{{ getTableRowNumber(index, topUpMeta?.currentPage!, topUpMeta?.perPage!) }}
						</template>
					</Column>

					<Column field="tenantName" header="Tenant Name">
						<template #body="{ data }">
							{{ data.tenantName }}
						</template>
					</Column>

					<Column field="amount" header="Amount">
						<template #body="{ data }">
							{{ data.amount.toLocaleString() }}
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
