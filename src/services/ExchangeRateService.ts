import useSWRV from "swrv"
import type { Ref } from "vue"

import fetcher from "./_fetcher"
import api from "./_api"
import type { ExchangeRateList, ExchangeRatePayload } from "@/types/exchange-rate"

export function getExchangeRateList(page: Ref<number>, limit: Ref<number>, search: Ref<string>) {
  const params = () => {
    const searchParams = new URLSearchParams({
      page: String(page.value),
      limit: String(limit.value),
    })

    if (search?.value && search.value.trim().length > 2) {
      searchParams.append('search', search.value.trim())
    }

    return searchParams.toString()
  }

  const url = () => "/landlord/exchange-rates?" + params()

  return useSWRV<ExchangeRateList>(url, fetcher)
}

export function getExchangeRateDetail(id: Ref<number | null>) {
  const url = () => id.value ? `/landlord/exchange-rates/${id.value}` : null
  return useSWRV(url, fetcher)
}

export function createExchangeRate(payload: ExchangeRatePayload) {
  return api.post('/landlord/exchange-rates', payload)
}

export function editExchangeRate(payload: ExchangeRatePayload, id: number) {
  return api.put(`/landlord/exchange-rates/${id}`, payload)
}

export function deleteExchangeRate(id: number) {
  return api.delete(`/landlord/exchange-rates/${id}`)
}
