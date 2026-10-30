<script setup lang="ts">
import { CheckIcon, ChevronLeftIcon } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { computed, watch } from 'vue';

import useForm from '@/composables/useForm';
import { ICardHeader, IErrorMessage } from '@/components';
import type { AdminTenantCatalogFeature, AdminTenantCreatePayload } from '@/types/admin-tenant';
import { getTenantCatalogOptions, getTenantDetail, createTenant, editTenant } from '@/services/AdminTenantService';
import { useToast } from 'primevue/usetoast';

const router = useRouter()
const route = useRoute()
const toast = useToast()
const currentTenantId = computed(() => route.params?.tenantId ? Number(route.params?.tenantId) : null)
const isTenantExists = computed(() => Boolean(currentTenantId.value))
const rootDomain = import.meta.env.VITE_API_ROOT_DOMAIN

const { form, errors, isSubmitting, submitForm } = useForm<AdminTenantCreatePayload>()

const {
	data: tenantData,
	isLoading: isLoadingTenant
} = getTenantDetail(currentTenantId)
const {
	data: tenantCatalogData,
	isLoading: isLoadingTenantCatalog,
} = getTenantCatalogOptions()

// Only show loading when in edit mode
const isLoading = computed(() => isTenantExists.value && isLoadingTenant.value)
const catalog = computed(() => tenantData.value?.catalog ?? tenantCatalogData.value?.catalog ?? null)
const productOptions = computed(() =>
	(catalog.value?.products ?? []).map((product) => ({
		label: product.label,
		value: product.key,
	}))
)
const availableFeatures = computed<AdminTenantCatalogFeature[]>(() => {
	if (!form.productKey) {
		return []
	}

	return (catalog.value?.features ?? []).filter((feature) =>
		feature.productKeys.includes(form.productKey as string)
	)
})
const isLandlordTenant = computed(() => form.tenantIdentifier === 'landlord')
const productConfigDisabled = computed(() => isSubmitting.value || isLandlordTenant.value)
const selectedProductLabel = computed(() => {
	if (!form.productKey) {
		return 'Not configured'
	}

	return productOptions.value.find((product) => product.value === form.productKey)?.label ?? form.productKey
})
const productConfigMessage = computed(() => {
	if (isLandlordTenant.value) {
		return 'Tenant landlord does not use modular product configuration.'
	}

	if (!form.productKey) {
		return 'Choose a product to enable product-specific features for this tenant.'
	}

	if (!availableFeatures.value.length) {
		return 'No modular features are available for the selected product yet.'
	}

	return null
})

// Initialize form with default values
Object.assign(form, {
	name				: '',
	tenantIdentifier	: '',
	maxUserTenants		: null,
	maxS3StorageGb		: isTenantExists.value ? null : 20,
	isActive			: true,
	isMaintenance		: false,
	isAiEnabled			: false,
	productKey			: 'school',
	enabledFeatureKeys	: [],
	zoomAccountMode		: 'alinnea',
})

watch(
	tenantData,
	currentTenant => {
		if (!currentTenant) return

		form.name 				= currentTenant.name
		form.tenantIdentifier 	= currentTenant.tenantIdentifier
		form.maxUserTenants 	= currentTenant.maxUserTenants
		form.maxS3StorageGb 	= currentTenant.maxS3StorageGb
		form.isActive 			= currentTenant.isActive
		form.isMaintenance 		= currentTenant.isMaintenance
		form.isAiEnabled 		= currentTenant.isAiEnabled
		form.productKey			= currentTenant.productKey
		form.enabledFeatureKeys	= [...(currentTenant.enabledFeatureKeys ?? [])]
		form.zoomAccountMode		= 'alinnea'
	},
	{ deep: true, immediate: true }
)

watch(
	() => form.productKey,
	(productKey) => {
		if (!productKey) {
			form.enabledFeatureKeys = []
			return
		}

		const allowedFeatureKeys = availableFeatures.value.map((feature) => feature.key)
		form.enabledFeatureKeys = form.enabledFeatureKeys.filter((featureKey) =>
			allowedFeatureKeys.includes(featureKey)
		)
	},
	{ immediate: true }
)

async function handleSubmit() {
	if (isTenantExists.value) {
		await editTenant(form, currentTenantId.value!)
		toast.add({ severity: 'success', summary: 'Tenant Updated', detail: 'Tenant has been updated successfully.', life: 3000 })
		router.push('/admin/tenants')
	} 
	else {
		const res = await createTenant(form)
		toast.add({ severity: 'success', summary: 'Tenant Created', detail: 'Tenant has been created successfully.', life: 3000 })
		router.push('/admin/tenants/detail/' + res.data.id)
	}
	
}
</script>

<template>
	<Card>
		<template #title>
			<ICardHeader
				title="Tenant Form"
				subtitle="Create new or edit the selected tenant."
				with-divider
				:is-loading="isLoading"
			>
				<RouterLink to="/admin/tenants">
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
						<InputText
							class="w-full"
							v-model="form.name"
							:invalid="!!errors?.name"
							:disabled="isSubmitting"
							placeholder="example: My School Name"
						/>
						<IErrorMessage :value="errors?.name" />
						<label>Tenant Name</label>
					</IftaLabel>

					<IftaLabel>
						<InputText
							class="w-full"
							v-model="form.tenantIdentifier"
							:invalid="!!errors?.tenantIdentifier"
							:disabled="isSubmitting"
							placeholder="example: my-school-name"
						/>
						<IErrorMessage :value="errors?.tenantIdentifier" />
						<label>Tenant Subdomain</label>
						<Message size="small" severity="secondary" variant="simple" class="mt-2">
							Use only letters (a-z), numbers (0-9), or dash (-). Must start with a letter.
						</Message>
						<Message v-if="form.tenantIdentifier" size="small" severity="info" variant="simple" class="mt-3">
							Your URL will be: &nbsp;
							<Tag severity="info" :value="form.tenantIdentifier + '.' + rootDomain"></Tag>
						</Message>
					</IftaLabel>

					<IftaLabel>
						<InputNumber
							class="w-full"
							v-model="form.maxUserTenants"
							:invalid="!!errors?.maxUserTenants"
							:disabled="isSubmitting"
							placeholder="example: 100"
						/>
						<IErrorMessage :value="errors?.maxUserTenants" />
						<label>Max Tenant Users</label>
						<Message size="small" severity="secondary" variant="simple" class="mt-2">
							Set the maximum number of tenant users allowed. 0 or null means unlimited.
						</Message>
					</IftaLabel>

					<IftaLabel>
						<InputNumber
							class="w-full"
							v-model="form.maxS3StorageGb"
							:invalid="!!errors?.maxS3StorageGb"
							:disabled="isSubmitting"
							:min="0"
							:min-fraction-digits="0"
							:max-fraction-digits="0"
							:use-grouping="false"
							placeholder="example: 20"
						/>
						<IErrorMessage :value="errors?.maxS3StorageGb" />
						<label>Max S3 Storage (GB)</label>
						<Message size="small" severity="secondary" variant="simple" class="mt-2">
							Set the maximum S3 storage in GB. Leave empty for unlimited. New tenants default to 20 GB.
						</Message>
					</IftaLabel>

					<section class="w-full sm:w-sm">
						<div class="flex justify-between items-center">
							<div class="flex-1">
								<label class="font-medium dark:font-medium text-gray-700 dark:text-gray-200 text-sm dark:text-sm">
									Is Active?
								</label>
								<p class="text-gray-500 dark:text-gray-400 text-xs dark:text-xs">
									Set tenant status to either active or inactive
								</p>
							</div>
							<ToggleSwitch 
								v-model="form.isActive" 
								:invalid="!!errors?.isActive"
							/>
						</div>
						<IErrorMessage :value="errors?.isActive" />
					</section>

					<section class="w-full sm:w-sm">
						<div class="flex justify-between items-center">
							<div class="flex-1">
								<label class="font-medium dark:font-medium text-gray-700 dark:text-gray-200 text-sm dark:text-sm">
									AI Features
								</label>
								<p class="text-gray-500 dark:text-gray-400 text-xs dark:text-xs">
									Enable AI features for tenant or not
								</p>
							</div>
							<ToggleSwitch
								v-model="form.isAiEnabled"
								:invalid="!!errors?.isAiEnabled"
							/>
						</div>
						<IErrorMessage :value="errors?.isAiEnabled" />
					</section>


					<section class="flex flex-col gap-2">
							<label class="font-medium text-gray-700 dark:text-gray-200 text-sm">
								Tenant Product
							</label>
							<SelectButton
								v-model="form.productKey"
								:options="productOptions"
								option-label="label"
								option-value="value"
								:allow-empty="false"
								:disabled="productConfigDisabled || isLoadingTenantCatalog"
							/>
							<IErrorMessage :value="errors?.productKey" />
						</section>

						<section class="gap-3 grid">
							<div class="flex justify-between items-center gap-4">
								<div>
									<p class="font-medium text-gray-700 dark:text-gray-200 text-sm">
										Enabled Modular Features
									</p>
									<p class="text-gray-500 dark:text-gray-400 text-xs">
										{{ selectedProductLabel }}
									</p>
								</div>
							</div>

							<div
								class="gap-3 grid"
								:class="{ 'opacity-60': productConfigDisabled }"
							>
								<label
									v-for="feature in availableFeatures"
									:key="feature.key"
									class="flex items-start gap-3 p-3 border border-surface-200 rounded-lg"
								>
									<Checkbox
										v-model="form.enabledFeatureKeys"
										:value="feature.key"
										:disabled="productConfigDisabled"
									/>
									<div class="gap-1 grid">
										<p class="font-medium text-gray-900 dark:text-gray-100 text-sm">
											{{ feature.label }}
										</p>
										<p class="text-gray-500 dark:text-gray-400 text-xs">
											{{ feature.key }}
										</p>
									</div>
								</label>

								<Message
									v-if="productConfigMessage"
									size="small"
									severity="secondary"
									variant="simple"
								>
									{{ productConfigMessage }}
								</Message>

								<Message
									v-else-if="!form.enabledFeatureKeys.length"
									size="small"
									severity="info"
									variant="simple"
								>
									No modular features enabled for this tenant yet.
								</Message>
							</div>
							<IErrorMessage :value="errors?.enabledFeatureKeys" />
						</section>

					<section class="flex justify-end gap-4 mt-6">
						<IButton 
							type="submit" 
							:label="isTenantExists ? 'Update Tenant' : 'Create Tenant'"
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
