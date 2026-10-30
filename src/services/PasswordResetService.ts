import type { PasswordResetApplyPayload, PasswordResetUpdatePayload } from "@/types/password-reset";
import type { GeneralResponse } from "@/types/meta";
import api from "./_api";

export function passwordResetApply (payload: PasswordResetApplyPayload) {
	const url = '/auth/password-reset/apply'
	return api.post <GeneralResponse> (url, payload)
}

export function passwordResetUpdate (payload: PasswordResetUpdatePayload) {
	const url = '/auth/password-reset/update'
	return api.post <GeneralResponse> (url, payload)
}