import type { Meta } from "./meta"
import type { RoleEnum } from "./user"

export interface AdminUserList {
  data: AdminUser[]
  meta: Meta
}

export interface AdminUser {
  id              : number,
  name            : string,
  email           : string,
  role		        : RoleEnum,
	emailVerifiedAt	?: string | null,
  createdAt	      : string,
  updatedAt	      : string,
}

export interface AdminUserCreatePayload {	
  name		  : string,
  email     : string,
  password	: string,
  role		  : RoleEnum,
}

export interface AdminUserEditPayload {	
  name		: string,
  email		: string,
  role		: RoleEnum,
}

export interface AdminUserResetPasswordResponse {
  message: string,
  user: Pick<AdminUser, 'name' | 'email' | 'role'> & { uuid?: string }
}