import useSWRV from "swrv"
import fetcher from "./_fetcher"
import type { UserProfile } from "@/types/user-profile"
import api from "./_api"

export function getProfileByEmail( email: string ) {
	const url = () => "/profile/" + email

	return useSWRV<UserProfile>(url, fetcher)
}

export async function updateProfile(email: string, data: { name: string, password?: string, password_confirmation?: string }) {
	try {
		const url = `/profile/${email}`
		const response = await api.put(url, data)
		return response.data
	} catch (error) {
		throw error
	}
}