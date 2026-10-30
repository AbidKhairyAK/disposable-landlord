import { getCurrentUser } from "@/services/AuthService";
import type { AuthSessionResponse, User } from "@/types/user";
import { defineStore } from "pinia";

type AuthState = {
	user: User | null,
	sessionInitialized: boolean,
}

function clearLegacyAuthStorage() {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
}

export const useAuthStore = defineStore('auth', {
	state: () : AuthState => ({
		user: getCurrentUser(),
		sessionInitialized: false,
	}),

	getters: {
		isAuthenticated: (state) => !!state.user,
		currentUser: (state) => state.user,
	},

	actions: {
		login(userData : AuthSessionResponse) {
			this.user = userData.user;
			this.sessionInitialized = true;
			clearLegacyAuthStorage();
		},
		logout() {
			this.user = null;
			this.sessionInitialized = true;
			clearLegacyAuthStorage();
		},
		setUser (user: User) {
			this.user = user
			this.sessionInitialized = true
			clearLegacyAuthStorage();
		},
		markSessionInitialized() {
			this.sessionInitialized = true
		}
	}
})