<script setup lang="ts">
import { ChevronLeftIcon, FilePenIcon } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import { ICardHeader } from '@/components';
import { getTenantDetail } from '@/services/AdminTenantService';
import { defaultPassword } from '@/configs/auth';

const route 			= useRoute()
const currentTenantId 	= computed(() => route.params?.tenantId ? Number(route.params?.tenantId) : null)
const rootDomain 		= import.meta.env.VITE_API_ROOT_DOMAIN

const {
	data,
	isLoading
} = getTenantDetail(currentTenantId)

const tenantSubdomain 	= computed(() => data.value?.tenantIdentifier + '.' + rootDomain)
const defaultUsers		= computed(() => data.value?.defaultUsers ?? [])
const enabledFeatureLabels = computed(() =>
	(data.value?.enabledFeatureKeys ?? []).map((featureKey) => {
		const feature = data.value?.catalog?.features.find((item) => item.key === featureKey)
		return {
			key: featureKey,
			label: feature?.label ?? featureKey,
		}
	})
)
const maxUserTenantsLabel = computed(() => {
	const value = data.value?.maxUserTenants
	return !value || value === 0 ? 'Unlimited' : String(value)
})
const maxS3StorageLabel = computed(() => {
	const value = data.value?.maxS3StorageGb
	return value == null ? 'Unlimited' : `${value} GB`
})
const productLabel = computed(() => {
	if (data.value?.tenantIdentifier === 'landlord') {
		return 'Not applicable'
	}

	if (!data.value?.productKey) {
		return 'Not configured'
	}

	return data.value.catalog?.products.find((product) => product.key === data.value?.productKey)?.label
		?? data.value.productKey
})

</script>

<template>
	<div class="gap-6 grid md:grid-cols-2">
		<Card>
			<template #title>
				<ICardHeader
					title="Tenant Detail"
					subtitle="Detail of the selected tenant."
					with-divider
					:is-loading="isLoading"
				>
					<RouterLink :to="'/admin/tenants/form/' + currentTenantId">
						<IButton label="Edit" :lucide="FilePenIcon" severity="secondary" />
					</RouterLink>
				</ICardHeader>
			</template>
			
			<template #content>
				<article class="gap-6 grid">
	
					<section class="gap-1 grid">
						<label class="font-bold text-xs">Tenant Name</label>
						<p>{{ data?.name }}</p>
					</section>
	
					<section class="gap-1 grid">
						<label class="font-bold text-xs">Identifier</label>
						<p>{{ data?.tenantIdentifier }}</p>
					</section>
	
					<section class="gap-1 grid">
						<label class="font-bold text-xs">Subdomain</label>
						<Button 
							as="a"
							severity="link"
							:label="tenantSubdomain" 
							:href="'https://' + tenantSubdomain" 
							target="_blank" 
							rel="noopener"
							class="justify-start! p-0!"
						/>
					</section>
	
					<section class="gap-1 grid">
						<label class="font-bold text-xs">DB Schema</label>
						<p>{{ data?.databaseSchema }}</p>
					</section>

					<section class="gap-1 grid">
						<label class="font-bold text-xs">Max Tenant Users</label>
						<p>{{ maxUserTenantsLabel }}</p>
					</section>

					<section class="gap-1 grid">
						<label class="font-bold text-xs">Max S3 Storage</label>
						<p>{{ maxS3StorageLabel }}</p>
					</section>

					<section class="gap-1 grid">
						<label class="font-bold text-xs">AI Features</label>
						<div>
							<Tag v-if="data?.isAiEnabled" severity="success" value="enabled" />
							<Tag v-else severity="secondary" value="disabled" />
						</div>
					</section>

					<section class="gap-1 grid">
						<label class="font-bold text-xs">Tenant Product</label>
						<p>{{ productLabel }}</p>
					</section>

					<section class="gap-1 grid">
						<label class="font-bold text-xs">Enabled Modular Features</label>
						<div v-if="data?.tenantIdentifier === 'landlord'">
							<Tag severity="secondary" value="Not applicable" />
						</div>
						<div v-else-if="enabledFeatureLabels.length" class="flex flex-wrap gap-2">
							<Tag
								v-for="feature in enabledFeatureLabels"
								:key="feature.key"
								severity="info"
								:value="feature.label"
							/>
						</div>
						<p v-else>No modular features enabled</p>
					</section>
	
					<section class="gap-1 grid">
						<label class="font-bold text-xs">Created At</label>
						<p>{{ data?.createdAt?.replace('T', ' ')?.slice(0, 16) }}</p>
					</section>
	
					<section class="gap-1 grid">
						<label class="font-bold text-xs">Updated At</label>
						<p>{{ data?.updatedAt?.replace('T', ' ')?.slice(0, 16) }}</p>
					</section>
	
				</article>
			</template>
		</Card>
		
		<Card>
			<template #title>
				<ICardHeader
					title="Default Users"
					subtitle="Automatically created for this tenant"
					with-divider
					:is-loading="isLoading"
				>
					<RouterLink to="/admin/tenants">
						<IButton label="Back" :lucide="ChevronLeftIcon" severity="secondary" />
					</RouterLink>
				</ICardHeader>
			</template>
			
			<template #content>
				<article class="gap-6 grid">
					<section class="gap-1 grid">
						<label class="font-bold text-xs">Initial Default Password</label>
						<p>{{ defaultPassword }}</p>
					</section>

					<section class="gap-3 grid">
						<div
							v-for="user in defaultUsers"
							:key="user.email"
							class="relative gap-3 grid p-4 border border-surface rounded-lg"
						>
							<section class="gap-1 grid">
								<label class="font-bold text-xs">Role</label>
								<p class="capitalize">{{ user.role }}</p>
							</section>

							<section class="gap-1 grid">
								<label class="font-bold text-xs">Name</label>
								<p>{{ user.name }}</p>
							</section>

							<section class="gap-1 grid">
								<label class="font-bold text-xs">Email</label>
								<p>{{ user.email }}</p>
							</section>
						</div>

						<p v-if="!defaultUsers.length" class="text-gray-500 text-sm">
							Default users are not available for this tenant yet.
						</p>
					</section>
				</article>
			</template>
		</Card>
	</div>
</template>
