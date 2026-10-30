<script setup lang="ts">
import { CheckIcon, ChevronLeftIcon, RefreshCcwIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';

import useForm from '@/composables/useForm';
import { defaultPassword } from '@/configs/auth';
import { ICardHeader, IErrorMessage } from '@/components';
import type { AdminUserCreatePayload } from '@/types/admin-user';
import { createUser, editUser, getUserDetail, resetUserPassword } from '@/services/AdminUserService';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { RoleEnum } from '@/types/user';

const router			= useRouter()
const route				= useRoute()
const confirm			= useConfirm()
const toast				= useToast()
const currentUserId 	= computed(() => route.params?.userId ? Number(route.params?.userId) : null)
const isUserExists 		= computed(() => Boolean(currentUserId.value))
const isResetting		= ref(false)
const showPassword		= ref(false)
const showRetypePassword = ref(false)
const retypePassword	= ref('')

const { form, errors, isSubmitting, submitForm } = useForm<AdminUserCreatePayload>()

const {
	data		: userData,
	isLoading	: isLoadingUser
} = getUserDetail(currentUserId)

watch(
	userData,
	currentUser => {
		if (!currentUser) return

		form.name	= currentUser.name
		form.email	= currentUser.email
		form.role	= currentUser.role
	},
	{ deep: true, immediate: true }
)

async function handleSubmit () {
	// Validate password match for new user
	if (!isUserExists.value && form.password !== retypePassword.value) {
		throw new Error('Passwords do not match. Please make sure both password fields match.')
	}

	if (isUserExists.value) await editUser(form, currentUserId.value!)
	else 					await createUser(form)
}

async function onSubmit() {
	try {
		await submitForm(handleSubmit)
		router.push('/admin/users')
	} catch (error) {
		// Error sudah di-handle oleh submitForm
	}
}

async function resetPassword () {
	try {
		isResetting.value = true

		const response = await resetUserPassword(currentUserId.value!)

		toast.add({
			severity: 'success',
			summary: 'Reset password success.',
			detail: response.data.message,
			life: 3000
		})
	} catch (err) {
		toast.add({
			severity: 'error',
			summary: 'Reset password failed.',
			life: 3000
		})
	} finally {
		isResetting.value = false
	}
}

function confirmResetPassword () {
	confirm.require({
		message: `Are you sure you want to reset the user's password?`,
		header: 'Confirmation',

		rejectProps: {
			label: 'Cancel',
			severity: 'secondary',
			outlined: true,
		},

		acceptProps: {
			label: 'Reset',
			severity: 'danger',
		},

		accept: resetPassword
	})
}

</script>

<template>
	
	<Card>
		<template #title>
			<ICardHeader
				title="User Form"
				subtitle="Create new or edit the selected user."
				with-divider
				:is-loading="isUserExists && isLoadingUser"
			>
				<RouterLink to="/admin/users">
					<IButton label="Back" :lucide="ChevronLeftIcon" severity="secondary" />
				</RouterLink>
			</ICardHeader>
		</template>
		
		<template #content>
			<form 
				class="w-full grid gap-5"
				@submit.prevent="onSubmit"
			>
				<IftaLabel>
					<InputText
						class="w-full"
						v-model="form.name"
						:invalid="!!errors?.name"
						:disabled="isSubmitting"
					/>
					<IErrorMessage :value="errors?.name" />
					<label>User Name</label>
				</IftaLabel>
			
				<IftaLabel>
					<InputText
						class="w-full"
						type="email"
						v-model="form.email"
						:invalid="!!errors?.email"
						:disabled="isSubmitting"
					/>
					<IErrorMessage :value="errors?.email" />
					<label>Email</label>
				</IftaLabel>
			
				<IftaLabel v-if="!isUserExists">
					<div class="relative">
						<InputText
							class="w-full pr-12"
							:type="showPassword ? 'text' : 'password'"
							v-model="form.password"
							:invalid="!!errors?.password"
							:disabled="isSubmitting"
						/>
						<button
							type="button"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
							@click="showPassword = !showPassword"
							:disabled="isSubmitting"
						>
							<EyeIcon v-if="!showPassword" class="w-5 h-5" />
							<EyeOffIcon v-else class="w-5 h-5" />
						</button>
					</div>
					<IErrorMessage :value="errors?.password" />
					<label>Password</label>
				</IftaLabel>

				<IftaLabel v-if="!isUserExists">
					<div class="relative">
						<InputText
							class="w-full pr-12"
							:type="showRetypePassword ? 'text' : 'password'"
							v-model="retypePassword"
							:invalid="!!(retypePassword && form.password !== retypePassword)"
							:disabled="isSubmitting"
						/>
						<button
							type="button"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
							@click="showRetypePassword = !showRetypePassword"
							:disabled="isSubmitting"
						>
							<EyeIcon v-if="!showRetypePassword" class="w-5 h-5" />
							<EyeOffIcon v-else class="w-5 h-5" />
						</button>
					</div>
					<IErrorMessage v-if="retypePassword && form.password !== retypePassword" value="Passwords do not match" />
					<label>Retype Password</label>
				</IftaLabel>

				<IftaLabel v-if="userData?.role !== RoleEnum.admin">
					<Select
						v-model="form.role"
						class="w-full" 
						:invalid="!!errors?.role"
						:disabled="isSubmitting"
						:options="[ RoleEnum.instructor, RoleEnum.student ]"
					/>
					<IErrorMessage :value="errors?.role" />
					<label>Role</label>
				</IftaLabel>
			
				<section class="flex flex-row-reverse gap-4 justify-between">
					<IButton 
						type="submit" 
						label="Submit" 
						size="large" 
						class="w-48 shadow" 
						:lucide="CheckIcon"
						:loading="isSubmitting"
					/>
					<IButton
						v-if="isUserExists"
						label="Reset Password"
						severity="secondary"
						size="large" 
						class="w-56" 
						:lucide="RefreshCcwIcon"
						:loading="isResetting"
						@click="confirmResetPassword"
					/>
				</section>
			</form>
		</template>
	</Card>

</template>