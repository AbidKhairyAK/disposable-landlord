import axios, { AxiosError } from "axios";
import { reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";


function useForm <T extends Object> ( initialValues:T = <T> {} )
{
	const form 			= reactive <T> (initialValues)
	
	const errors 		= ref <Record<keyof T, string|undefined> | Record<string, string|undefined>> ()
	const errorMessage	= ref <string> () 
	
	const isSubmitting 	= ref(false)
	const isError 		= ref(false)
	
	const toast = useToast();
	
	interface ErrorItem {
		message: string,
		rule: string,
		field: string,
	}
	interface ValidationError {
		errors?: ErrorItem[],
		message?: string
	}
	interface SubmitFormOption {
		disableSuccessToast?: boolean
		disableErrorToast?: boolean
	}

	async function submitForm ( callback:Function, option: SubmitFormOption = {} ) {
		try {
			isSubmitting.value = true
			resetError()
			await callback()

			if (!option.disableSuccessToast) {
				toast.add({ 
					severity: 'success', 
					summary: 'Success', 
					detail: "Form submitted successfully!", 
					life: 3000 
				});
			}
		}
		catch ( err: any | Error | AxiosError<ValidationError> ) {
			isError.value = true

			if ( axios.isAxiosError(err) && (err?.response?.data?.errors || err?.response?.data?.message) ) {
				processError(err?.response?.data)
			} else {
				errorMessage.value 	= err?.message || err
			}
			
			if (!option.disableErrorToast) {
				toast.add({ 
					severity: 'error', 
					summary: 'Error', 
					detail: errorMessage.value, 
					life: 3000 
				});
			}
			
			throw err
		}
		finally {
			isSubmitting.value = false
		}
	}

	function processError ( err:ValidationError ) {
		const isSingleError = err?.errors?.length === 1 && !err.errors[0].field && (err.errors[0].message || err?.message)
		
		if (!isSingleError && err?.errors?.length) {
			// apa apaan ini dawg 💀
			const errorsObject : Record<keyof T, string|undefined> | Record<string, string|undefined> = {}
			for (const error of err.errors) {
				errorsObject[error.field] = error.message
			}
			errors.value = errorsObject
			errorMessage.value = 'Please check you form again!'
		} else {
			errorMessage.value = err?.errors?.length ? err?.errors[0].message : err?.message
		}
	}

	function resetError () {
		isError.value 		= false
		errors.value 		= {}
		errorMessage.value	= ''
	}

	function setForm ( newForm:T ) {
		Object.assign(form, newForm)
	}

	return {
		form,
		errorMessage,
		errors,
		submitForm,
		setForm,
		isSubmitting,
		isLoading: isSubmitting,
		isError,
		resetError
	}
}

export default useForm