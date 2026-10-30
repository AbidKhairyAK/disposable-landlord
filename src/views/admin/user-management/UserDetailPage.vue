<script setup lang="ts">
import { ChevronLeftIcon } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import { ICardHeader } from '@/components';
import { getUserDetail } from '@/services/AdminUserService';

const route				= useRoute()
const currentUserId 	= computed(() => route.params?.userId ? Number(route.params?.userId) : null)

const {
	data		: userData,
	isLoading	: isLoadingUser
} = getUserDetail(currentUserId)

const formatDate = (dateString?: string) => {
	if (!dateString) return '-'
	const date = new Date(dateString)
	return date.toLocaleDateString('en-EN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

</script>

<template>
	
	<Card>
		<template #title>
			<ICardHeader
				title="User Detail"
				subtitle="Detail of the selected user."
				with-divider
				:is-loading="isLoadingUser"
			>
				<RouterLink to="/admin/users">
					<IButton label="Back" :lucide="ChevronLeftIcon" severity="secondary" />
				</RouterLink>
			</ICardHeader>
		</template>
		
		<template #content>
			<table>
				<tbody>
					<tr>
						<th class="p-3 pr-9 text-left">Name : </th>
						<td class="p-3">{{ userData?.name }}</td>
					</tr>
					<tr>
						<th class="p-3 pr-9 text-left">Email : </th>
						<td class="p-3">{{ userData?.email }}</td>
					</tr>
					<tr>
						<th class="p-3 pr-9 text-left">Role : </th>
						<td class="p-3">{{ userData?.role }}</td>
					</tr>
					<tr>
						<th class="p-3 pr-9 text-left">Created At : </th>
						<td class="p-3">{{ formatDate(userData?.createdAt) }}</td>
					</tr>
					<tr>
						<th class="p-3 pr-9 text-left">Updated At : </th>
						<td class="p-3">{{ formatDate(userData?.updatedAt) }}</td>
					</tr>
				</tbody>
			</table>
		</template>
	</Card>
</template>