import { useAuthStore } from "@/stores/auth-store";
import type { AuthSessionResponse, User } from "@/types/user";
import api from "./_api";

function clearLegacyAuthStorage() {
	localStorage.removeItem('user');
	localStorage.removeItem('token');
}

export async function login(email: string, password: string) {
	try {	
		const url = '/landlord/auth/login'
		const response = await api.post <AuthSessionResponse> (url, {
			email,
			password
		});
		if(response.data.user){
			const authStore = useAuthStore()
			authStore.login(response.data);
		}
		return response.data
	}catch(error) {
    	throw error;
	}

}

export async function logout() {
	const authStore = useAuthStore()

	try {
		await api.post('/landlord/auth/logout')
	} finally {
		authStore.logout()
	}
}

export function getCurrentUser() {
	clearLegacyAuthStorage();
	return null;
}

export async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    try {
        const url = 'auth/register';
        const response = await api.post<AuthSessionResponse>(url, {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation
        });
		if(response.data.user){
			const authStore = useAuthStore()
			authStore.login(response.data);
		}
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getProfile () {
	const url = '/landlord/auth/me'
	const res = await api.get <User> (url)

	if (res.data) {
		const authStore = useAuthStore()			
		authStore.setUser(res.data)
	}

	return res
}
