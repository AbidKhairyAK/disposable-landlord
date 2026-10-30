<script setup lang="ts">
import { CheckIcon, ChevronLeftIcon } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'

import useForm from '@/composables/useForm'
import { IButton, ICardHeader, IErrorMessage } from '@/components'
import type { ExchangeRatePayload } from '@/types/exchange-rate'
import { getExchangeRateDetail, createExchangeRate, editExchangeRate } from '@/services/ExchangeRateService'

const router  = useRouter()
const route   = useRoute()
const toast   = useToast()

const currentId    = computed(() => route.params?.id ? Number(route.params.id) : null)
const isEditMode   = computed(() => Boolean(currentId.value))

const { form, errors, isSubmitting, submitForm } = useForm<ExchangeRatePayload>()

Object.assign(form, {
	from_currency : '',
	to_currency   : '',
	rate          : null,
})

const { data: rateData, isLoading: isLoadingRate } = getExchangeRateDetail(currentId)

const isLoading = computed(() => isEditMode.value && isLoadingRate.value)

watch(
	rateData,
	(current) => {
		if (!current) return
		form.from_currency = current.fromCurrency
		form.to_currency   = current.toCurrency
		form.rate          = current.rate
	},
	{ deep: true, immediate: true }
)

async function handleSubmit() {
	if (isEditMode.value) {
		await editExchangeRate(form, currentId.value!)
		toast.add({ severity: 'success', summary: 'Rate Updated', detail: 'Exchange rate has been updated successfully.', life: 3000 })
	} else {
		await createExchangeRate(form)
		toast.add({ severity: 'success', summary: 'Rate Created', detail: 'Exchange rate has been created successfully.', life: 3000 })
	}
	router.push('/admin/exchange-rates')
}
</script>

<template>
	<Card>
		<template #title>
			<ICardHeader
				:title="isEditMode ? 'Edit Exchange Rate' : 'Add Exchange Rate'"
				:subtitle="isEditMode ? 'Update the exchange rate.' : 'Add a new currency exchange rate.'"
				with-divider
			>
				<RouterLink to="/admin/exchange-rates">
					<IButton label="Back" :lucide="ChevronLeftIcon" severity="secondary" />
				</RouterLink>
			</ICardHeader>
		</template>

		<template #content>
			<div v-if="isLoading" class="flex justify-center py-8">
				<ProgressSpinner />
			</div>

			<form
				v-else
				class="mx-auto w-full"
				@submit.prevent="submitForm(handleSubmit, { disableSuccessToast: true })"
			>
				<div class="flex flex-col gap-8">
					<IftaLabel>
						<InputText
							class="w-full"
							v-model="form.from_currency"
							:invalid="!!errors?.from_currency"
							:disabled="isSubmitting"
							placeholder="example: USD"
						/>
						<IErrorMessage :value="errors?.from_currency" />
						<label>From Currency</label>
					</IftaLabel>

					<IftaLabel>
						<InputText
							class="w-full"
							v-model="form.to_currency"
							:invalid="!!errors?.to_currency"
							:disabled="isSubmitting"
							placeholder="example: IDR"
						/>
						<IErrorMessage :value="errors?.to_currency" />
						<label>To Currency</label>
					</IftaLabel>

					<IftaLabel>
						<InputNumber
							class="w-full"
							v-model="form.rate"
							:invalid="!!errors?.rate"
							:disabled="isSubmitting"
							:min="0"
							:use-grouping="true"
							placeholder="example: 15000.00"
						/>
						<IErrorMessage :value="errors?.rate" />
						<label>Rate</label>
					</IftaLabel>

					<section class="flex justify-end gap-4 mt-6">
						<IButton
							type="submit"
							:label="isEditMode ? 'Update Rate' : 'Add Rate'"
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
