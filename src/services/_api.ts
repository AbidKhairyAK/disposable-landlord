import { isPureObject } from '@/lib/utils'
import { useAuthStore } from "@/stores/auth-store"
import axios, { type InternalAxiosRequestConfig } from "axios"
import router from "@/router"

const hostname = window.location.hostname;
// misal: "app.example.com"

const parts = hostname.split('.');

let subdomain = null;
let baseURL: string

if (parts.length > 2) {
  subdomain = parts[0];
}

if (subdomain) {
  const protocol = window.location.protocol;
  const rootDomain = import.meta.env.VITE_API_ROOT_DOMAIN

  baseURL = `${protocol}//${subdomain}.${rootDomain}/api`
} 
else {
  baseURL = import.meta.env.VITE_API_URL || "http://localhost:3333"
}


let csrfTokenCache: string | null = null

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

function getErrorStatus(error: any) {
  return error?.response?.status ?? error?.status
}

function isSessionProbe(error: any) {
  const url = error?.config?.url ?? ""
  return typeof url === "string" && url.includes("/landlord/auth/me")
}

function getCookieValue(name: string) {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null
}

function getCsrfToken() {
  return csrfTokenCache
    ?? getCookieValue('__Host-alinnea_landlord_csrf')
    ?? getCookieValue('alinnea_landlord_csrf')
}

function syncCsrfTokenFromResponse(data: any) {
  if (typeof data?.csrfToken === 'string' && data.csrfToken.length > 0) {
    csrfTokenCache = data.csrfToken
  }
}

function injectCsrfToken(config: InternalAxiosRequestConfig<any>) {
  const method = config.method?.toUpperCase()

  if (!method || !['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return config
  }

  const csrfToken = getCsrfToken()
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }

  return config
}

function isInvalidCsrfError(error: any) {
  const responseData = error?.response?.data

  return error?.response?.status === 403 && (
    responseData?.code === 'E_INVALID_CSRF_TOKEN' ||
    responseData?.message === 'Invalid CSRF token'
  )
}

async function refreshCsrfToken() {
  const response = await api.get('/landlord/auth/csrf')
  syncCsrfTokenFromResponse(response.data)
}


// Axios request interceptor untuk menghilangkan whitespace pada body
function trimJsonBody (config: InternalAxiosRequestConfig<any>) {
  let body = config.data

  if (body instanceof FormData) {
    for (const index in Object.fromEntries(body)) {
      // kalau bodynya string, maka whitespace dihilangkan
      const value = body.get(index)
      if (typeof value === 'string') body.set(index, value.trim())
    }
  }

  if (isPureObject(body)) {
    for (const index in body) {
      // kalau bodynya string, maka whitespace dihilangkan
      body[index] = typeof body[index] === 'string' ? body[index]?.trim() : body[index]
    }
  }
  
  return config
}


api.interceptors.request.use(
  (config) => {
    let newConfig = config
    
    newConfig = trimJsonBody(config)
    newConfig = injectCsrfToken(config)

    return newConfig
  },
  (error) => {
    return Promise.reject(error)
  }
)


api.interceptors.response.use(
  response => {
    syncCsrfTokenFromResponse(response.data)
    return response
  },
  async error => {
    const originalConfig = error?.config

    if (isInvalidCsrfError(error) && originalConfig && !originalConfig.__csrfRetried) {
      originalConfig.__csrfRetried = true

      try {
        await refreshCsrfToken()
        return api.request(originalConfig)
      } catch {
        // Continue to normal error handling below.
      }
    }

    const errorStatus = getErrorStatus(error)

    if (errorStatus == 413) {
      error.message = "Your uploaded file size is too big!"
    }

    if (errorStatus == 401) {
      error.message = "Your session is expired. please login again!"
      const authStore = useAuthStore()
      authStore.logout()

      if (!isSessionProbe(error)) {
        const currentPath = window.location.pathname
        if (!currentPath.startsWith('/auth')) {
          router.push({
            name: 'auth.login',
            query: { redirect: currentPath }
          })
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
