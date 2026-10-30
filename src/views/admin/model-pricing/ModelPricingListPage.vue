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
import { getModelPricingList, deleteModelPricing } from '@/services/ModelPricingService'

const page            = ref(1)
const limit           = ref(10)
const searchTerm      = ref('')
const debouncedSearch = useDebounce(searchTerm, 500)

const router  = useRouter()
const toast   = useToast()
const confirm = useConfirm()

const {
	data      : allPricings,
	isLoading : isLoadingPricings,
	mutate    : mutatePricings,
} = getModelPricingList(page, limit, debouncedSearch)

const pricingData = computed(() => allPricings.value?.data ?? [])
const pricingMeta = computed(() => allPricings.value?.meta)

function handlePageChange(event: DataTablePageEvent) {
	page.value  = event.page + 1
	limit.value = event.rows
}

function confirmDelete(id: number, label: string) {
	confirm.require({
		message: `Are you sure you want to delete the pricing for "${label}"?`,
		header: 'Delete Confirmation',
		icon: 'pi pi-exclamation-triangle',
		rejectProps: { label: 'Cancel', severity: 'secondary' },
		acceptProps: { label: 'Delete', severity: 'danger' },
		accept: async () => {
			await deleteModelPricing(id)
			mutatePricings()
			toast.add({ severity: 'success', summary: 'Deleted', detail: 'Model pricing has been deleted.', life: 3000 })
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
					title="Model Pricing"
					subtitle="Manage AI model pricing configurations."
				>
					<div class="flex flex-col items-start md:items-end gap-2 w-fit">
						<RouterLink to="/admin/model-pricings/form">
							<IButton label="Add Pricing" :lucide="PlusIcon" />
						</RouterLink>
						<SearchBar
							v-model="searchTerm"
							placeholder="Search by model or type..."
						/>
					</div>
				</ICardHeader>
			</template>

			<template #content>
				<DataTable
					id="model-pricing-table"
					class="border border-surface rounded-border overflow-hidden"
					lazy
					paginator
					:loading="isLoadingPricings"
					:value="pricingData"
					:rows="pricingMeta?.perPage"
					:total-records="pricingMeta?.total"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					@page="handlePageChange"
				>
					<template #empty> No data... </template>

					<Column header="No" body-class="w-[50px]">
						<template #body="{ index }">
							{{ getTableRowNumber(index, pricingMeta?.currentPage!, pricingMeta?.perPage!) }}
						</template>
					</Column>

					<Column field="model" header="Model">
						<template #body="{ data }">
							{{ data.model }}
						</template>
					</Column>

					<Column field="type" header="Type">
						<template #body="{ data }">
							{{ data.type }}
						</template>
					</Column>

					<Column field="unit" header="Unit">
						<template #body="{ data }">
							{{ data.unit }}
						</template>
					</Column>

					<Column field="perUnits" header="Per Units">
						<template #body="{ data }">
							{{ data.perUnits.toLocaleString() }}
						</template>
					</Column>

					<Column field="input_price_per_unit" header="Input Price">
						<template #body="{ data }">
							{{ data.inputPricePerUnit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }}
							{{ data.currency }}
						</template>
					</Column>

					<Column field="output_price_per_unit" header="Output Price">
						<template #body="{ data }">
							<span v-if="data.outputPricePerUnit != null">
								{{ data.outputPricePerUnit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }}
								{{ data.currency }}
							</span>
							<span v-else class="text-surface-400">-</span>
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
									@click="router.push(`/admin/model-pricings/form/${data.id}`)"
								/>
								<IButton
									label="Delete"
									size="small"
									severity="secondary"
									:lucide="Trash2Icon"
									@click="confirmDelete(data.id, data.model)"
								/>
							</section>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</main>
</template>
