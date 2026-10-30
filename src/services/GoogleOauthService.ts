import type { AuthSessionResponse } from "@/types/user";
import api from "./_api";

export function googleOauthRedirect() {
	return api.get <string> ('/auth/google/redirect')
}

export function googleOauthCallback (callbackSearchParam: string) {
	const url = new URL(import.meta.env.VITE_API_URL + '/auth/google/callback')
	url.search = callbackSearchParam
	
	return api.get <AuthSessionResponse> (url.toString())
}