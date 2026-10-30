export interface User {
	id				: number,
	email			: string,
	name			: string,
	role			: RoleEnum,
	isGoogleAuth	?: boolean,
	emailVerifiedAt	?: string | null,
	createdAt		: string,
	updatedAt		: string,
}

export interface AuthSessionResponse {
	user: User | null,
	csrfToken?: string | null,
	requireApproval?: boolean,
}

export enum RoleEnum {
	admin		= 'admin',
	instructor	= 'instructor',
	student 	= 'student',
}