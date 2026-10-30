<script setup lang="ts">
import { ref, useTemplateRef, watch, watchEffect } from 'vue';
import { FolderIcon, XIcon } from 'lucide-vue-next';
import { useEventListener } from '@vueuse/core'
import IButton from './IButton.vue';

const props = defineProps<{
	label: string,
	existingImageUrl?: string | null
	invalid?: any
	readonly?: boolean,
	disabled?: boolean
}>()

const imageFile		= defineModel<File | null>('imageFile')
const imageRemove	= defineModel<boolean | null>('imageRemove')

const fileInputRef	= useTemplateRef('file-input')
const imagePreview	= ref('')
const imageRef = useTemplateRef('image-section')
const isFocused = ref(false)

watch(() => props.existingImageUrl, (newUrl) => {
	imagePreview.value = newUrl || ''
}, { immediate: true })

function handleFileInput (e:Event) {
	const inputElement = e.target as HTMLInputElement
	if (inputElement.files && inputElement.files.length > 0) {
		setImage(inputElement.files[0])
	}
}

function setImage ( image:File ) {
	imageFile.value = image
	imagePreview.value = URL.createObjectURL(image);
}

function removeImage () {
	imageFile.value = null
	imagePreview.value = ''
	if (props.existingImageUrl) imageRemove.value = true
}

function openFile () {
	fileInputRef?.value?.click()
}

function handleFocus() {
    isFocused.value = true
}

function handleBlur() {
    isFocused.value = false
}

useEventListener(imageRef, 'paste', function ( event:ClipboardEvent ) {
    const pastedImages = event.clipboardData?.files
    if (pastedImages && pastedImages.length > 0) {
		setImage(pastedImages[0])
    }
})

</script>

<template>
	<section 
	    ref="image-section"
        tabindex="0"
        :class="[
            'border shadow-xs rounded-border p-4 pt-2 w-full max-w-md transition-colors duration-200 outline-none',
            (!invalid ? (isFocused ? 'border-orange-500' : 'border-surface-300') : 'border-red-500'),
        ]"
		@focus="handleFocus"
        @blur="handleBlur"
	>
		<label class="text-surface-600 text-xs mb-3 block">
			{{ label }}
		</label>

		<img 
			:src="imagePreview || '/images/noimage.jpg'"
			class="rounded-border aspect-[4/3] w-full mb-3 object-cover"
		>
		<input
			ref="file-input"
			class="hidden"
			type="file"
			@change="handleFileInput"
		>
		<IButton
			label="Select Image"
			severity="secondary"
			class="mr-3"
			:lucide="FolderIcon"
			:disabled="readonly || disabled"
			@click="openFile"
		/>
		<IButton 
			v-if="imagePreview"
			label="Remove Image"
			severity="secondary"
			:disabled="readonly || disabled"
			:lucide="XIcon"
			@click="removeImage"
		/>
	</section>
</template>