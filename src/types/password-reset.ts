export interface PasswordResetApplyPayload {
	email: string
}

export interface PasswordResetUpdatePayload {
	token: string,
	password: string,
	password_confirmation: string,
}