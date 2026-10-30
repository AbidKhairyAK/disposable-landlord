<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import { login } from '@/services/AuthService';
import useForm from '@/composables/useForm';
import { IButton } from '@/components';

const router = useRouter();
const toast = useToast()
const logoUrl = '/logo.png'
const heroImageUrl = '/images/landing/hero.png'

const { form, errors, submitForm, isSubmitting } = useForm({
    email: '',
    password: '',
})

const handleLogin = async () => {
    const userAuth = await login(form.email, form.password)

    toast.add({
        severity: 'success',
        summary: `Welcome ${userAuth.user?.name || ''}!`,
        detail: 'You has been logged in successfully',
        life: 3000
    })

    if (userAuth.user?.role === 'admin') {
        router.push('/admin')
    } else {
        router.push({ name: 'auth.access_denied' })
    }
}
</script>

<template>
    <div class="flex min-h-screen overflow-hidden">
        <div class="hidden relative lg:flex bg-gradient-to-br from-blue-600 to-blue-800 lg:w-2/3 overflow-hidden">
            <div 
                class="absolute inset-0 bg-cover bg-no-repeat bg-center"
                :style="{ backgroundImage: `url(${heroImageUrl})` }">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-blue-800/60"></div>
            </div>
            
            <div class="z-10 relative flex flex-col justify-center items-center px-12 w-full text-white">
                <div class="max-w-lg text-center">
                    <p class="mb-4 font-semibold text-blue-200 text-sm uppercase tracking-wider">Welcome Back</p>
                    <h1 class="mb-6 font-bold text-5xl leading-tight">Manage Your Tenant Platform</h1>
                    <p class="mb-8 text-blue-100 text-lg leading-relaxed">
                        Sign in to the landlord dashboard to manage tenants, configuration,
                        and central platform operations from one place.
                    </p>
                </div>
            </div>
        </div>

        <div class="flex justify-center items-center bg-white px-6 sm:px-12 w-full lg:w-1/3 min-h-screen">
            <div class="w-full max-w-md">
                <div class="mb-4 text-center">
                    <div class="inline-block mb-4">
                        <img :src="logoUrl" alt="logo" class="mx-auto w-auto h-16" />
                    </div>
                    <h2 class="mb-2 font-bold text-gray-800 text-3xl">Sign In</h2>
                    <p class="text-gray-500 text-sm">Use your landlord account email and password</p>
                </div>

                <form
                    @submit.prevent="submitForm(handleLogin, { disableSuccessToast: true })"
                    class="w-full">
                    <IftaLabel>
                        <InputText
                            v-model="form.email"
                            :invalid="!!errors?.email"
                            class="!px-4 !border-2 focus:!border-blue-500 !rounded-full w-full !h-12 !transition-all !duration-300" />
                        <IErrorMessage :value="errors?.email" />    
                        <label class="!px-2">Email</label>
                    </IftaLabel>
                    
                    <IftaLabel class="mt-6">
                        <Password 
                            id="password" 
                            v-model="form.password" 
                            :invalid="!!errors?.password" 
                            :toggleMask="true" 
                            class="mb-4 w-full" 
                            fluid
                            inputClass="!h-12 !border-2 focus:!border-blue-500 !rounded-full !transition-all !duration-300 !px-4"
                            :feedback="false">
                        </Password>
                        <IErrorMessage :value="errors?.password" />
                        <label class="!px-2">Password</label>
                    </IftaLabel>
                    
                    <IButton 
                        type="submit" 
                        label="Sign In" 
                        size="large" 
                        class="!bg-blue-600 hover:!bg-blue-700 !shadow-md hover:!shadow-lg !border-none !rounded-full w-full h-12 !transition-all !duration-300"
                        :loading="isSubmitting" />
                </form>

                <p class="mt-4 text-gray-400 text-xs text-center">
                    Landlord access is restricted to authorized administrators.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
