import type { GeneralResponse } from "@/types/meta";
import api from "./_api";

export function verifyEmailApply () {
	const url = '/auth/verify-email/apply'
	return api.post <GeneralResponse> (url)
}