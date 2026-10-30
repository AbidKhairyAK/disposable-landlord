<script setup lang="ts">
import { CheckIcon, ChevronLeftIcon } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'

import useForm from '@/composables/useForm'
import { IButton, ICardHeader, IErrorMessage } from '@/components'
import type { ModelPricingPayload } from '@/types/model-pricing'
import { getModelPricingDetail, createModelPricing, editModelPricing } from '@/services/ModelPricingService'

const router = useRouter()
const route  = useRoute()
const toast  = useToast()

const currentId  = computed(() => route.params?.id ? Number(route.params.id) : null)
const isEditMode = computed(() => Boolean(currentId.value))

const { form, errors, isSubmitting, submitForm } = useForm<ModelPricingPayload>()

Object.assign(form, {
	model                 : '',
	type                  : '',
	unit                  : '',
	per_units             : null,
	input_price_per_unit  : null,
	output_price_per_unit : null,
	currency              : '',
})

const { data: pricingData, isLoading: isLoadingPricing } = getModelPricingDetail(currentId)

const isLoading = computed(() => isEditMode.value && isLoadingPricing.value)

watch(
	pricingData,
	(current) => {
		if (!current) return
		form.model                 = current.model
		form.type                  = current.type
		form.unit                  = current.unit
		form.per_units             = current.perUnits
		form.input_price_per_unit  = current.inputPricePerUnit
		form.output_price_per_unit = current.outputPricePerUnit
		form.currency              = current.currency
	},
	{ deep: true, immediate: true }
)

async function handleSubmit() {
	if (isEditMode.value) {
		await editModelPricing(form, currentId.value!)
		toast.add({ severity: 'success', summary: 'Pricing Updated', detail: 'Model pricing has been updated successfully.', life: 3000 })
	} else {
		await createModelPricing(form)
		toast.add({ severity: 'success', summary: 'Pricing Created', detail: 'Model pricing has been created successfully.', life: 3000 })
	}
	router.push('/admin/model-pricings')
}
</script>

<template>
	<Card>
		<template #title>
			<ICardHeader
				:title="isEditMode ? 'Edit Model Pricing' : 'Add Model Pricing'"
				:subtitle="isEditMode ? 'Update the model pricing.' : 'Add a new AI model pricing configuration.'"
				with-divider
			>
				<RouterLink to="/admin/model-pricings">
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
							v-model="form.model"
							:invalid="!!errors?.model"
							:disabled="isSubmitting"
							placeholder="example: gpt-4o"
						/>
						<IErrorMessage :value="errors?.model" />
						<label>Model</label>
					</IftaLabel>

					<IftaLabel>
						<InputText
							class="w-full"
							v-model="form.type"
							:invalid="!!errors?.type"
							:disabled="isSubmitting"
							placeholder="example: chat"
						/>
						<IErrorMessage :value="errors?.type" />
						<label>Type</label>
					</IftaLabel>

					<IftaLabel>
						<InputText
							class="w-full"
							v-model="form.unit"
							:invalid="!!errors?.unit"
							:disabled="isSubmitting"
							placeholder="example: token"
						/>
						<IErrorMessage :value="errors?.unit" />
						<label>Unit</label>
					</IftaLabel>

					<IftaLabel>
						<InputNumber
							class="w-full"
							v-model="form.per_units"
							:invalid="!!errors?.per_units"
							:disabled="isSubmitting"
							:min="1"
							:use-grouping="true"
							placeholder="example: 1000"
						/>
						<IErrorMessage :value="errors?.per_units" />
						<label>Per Units</label>
					</IftaLabel>

					<IftaLabel>
						<InputNumber
							class="w-full"
							v-model="form.input_price_per_unit"
							:invalid="!!errors?.input_price_per_unit"
							:disabled="isSubmitting"
							:min="0"
							:min-fraction-digits="2"
							:max-fraction-digits="6"
							:use-grouping="false"
							placeholder="example: 0.000002"
						/>
						<IErrorMessage :value="errors?.input_price_per_unit" />
						<label>Input Price per Unit</label>
					</IftaLabel>

					<IftaLabel>
						<InputNumber
							class="w-full"
							v-model="form.output_price_per_unit"
							:invalid="!!errors?.output_price_per_unit"
							:disabled="isSubmitting"
							:min="0"
							:min-fraction-digits="2"
							:max-fraction-digits="6"
							:use-grouping="false"
							placeholder="example: 0.000006 (optional)"
						/>
						<IErrorMessage :value="errors?.output_price_per_unit" />
						<label>Output Price per Unit (optional)</label>
					</IftaLabel>

					<IftaLabel>
						<InputText
							class="w-full"
							v-model="form.currency"
							:invalid="!!errors?.currency"
							:disabled="isSubmitting"
							placeholder="example: USD"
						/>
						<IErrorMessage :value="errors?.currency" />
						<label>Currency</label>
					</IftaLabel>

					<section class="flex justify-end gap-4 mt-6">
						<IButton
							type="submit"
							:label="isEditMode ? 'Update Pricing' : 'Add Pricing'"
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
