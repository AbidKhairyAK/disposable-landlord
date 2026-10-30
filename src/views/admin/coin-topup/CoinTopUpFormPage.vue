<script setup lang="ts">
import { CheckIcon, ChevronLeftIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

import useForm from '@/composables/useForm'
import { IButton, ICardHeader, IErrorMessage } from '@/components'
import { useToast } from 'primevue/usetoast'
import type { CoinTopUpCreatePayload } from '@/types/coin-topup'
import { createCoinTopUp } from '@/services/CoinTopUpService'
import { getTenantList } from '@/services/AdminTenantService'

const router = useRouter()
const toast  = useToast()

const { form, errors, isSubmitting, submitForm } = useForm<CoinTopUpCreatePayload>()

Object.assign(form, {
	tenant_id : '',
	amount    : null,
})

const {
	data      : allTenants,
	isLoading : isLoadingTenants,
} = getTenantList(ref(1), ref(999), ref(''))

const tenantOptions = computed(() =>
	allTenants.value?.data.map(t => ({
		label : t.name,
		value : t.databaseSchema,
	})) ?? []
)

async function handleSubmit() {
	await createCoinTopUp(form)
	toast.add({ severity: 'success', summary: 'Top Up Created', detail: 'Coin top-up has been created successfully.', life: 3000 })
	router.push('/admin/coin-top-ups')
}
</script>

<template>
	<Card>
		<template #title>
			<ICardHeader
				title="Create Coin Top Up"
				subtitle="Add coin top-up for a tenant."
				with-divider
			>
				<RouterLink to="/admin/coin-top-ups">
					<IButton label="Back" :lucide="ChevronLeftIcon" severity="secondary" />
				</RouterLink>
			</ICardHeader>
		</template>

		<template #content>
			<form
				class="mx-auto w-full"
				@submit.prevent="submitForm(handleSubmit, { disableSuccessToast: true })"
			>
				<div class="flex flex-col gap-8">
					<IftaLabel>
						<Select
							class="w-full"
							v-model="form.tenant_id"
							:options="tenantOptions"
							option-label="label"
							option-value="value"
							:loading="isLoadingTenants"
							:invalid="!!errors?.tenant_id"
							:disabled="isSubmitting"
							placeholder="Select a tenant..."
						/>
						<IErrorMessage :value="errors?.tenant_id" />
						<label>Tenant</label>
					</IftaLabel>

					<IftaLabel>
						<InputNumber
							class="w-full"
							v-model="form.amount"
							:invalid="!!errors?.amount"
							:disabled="isSubmitting"
							:min="1"
							:use-grouping="true"
							placeholder="example: 100000"
						/>
						<IErrorMessage :value="errors?.amount" />
						<label>Amount</label>
					</IftaLabel>

					<section class="flex justify-end gap-4 mt-6">
						<IButton
							type="submit"
							label="Create Top Up"
							size="large"
							class="shadow"
							:lucide="CheckIcon"
							:loading="isSubmitting"
						/>
					</section>
				</div>
			</form>
		</template>
	</Card>
</template>
