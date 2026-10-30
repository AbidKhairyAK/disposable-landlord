import useSWRV from "swrv"
import type { Ref } from "vue"

import fetcher from "./_fetcher"
import api from "./_api"
import type { ModelPricingList, ModelPricingPayload } from "@/types/model-pricing"

export function getModelPricingList(page: Ref<number>, limit: Ref<number>, search: Ref<string>) {
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

  const url = () => "/landlord/model-pricings?" + params()

  return useSWRV<ModelPricingList>(url, fetcher)
}

export function getModelPricingDetail(id: Ref<number | null>) {
  const url = () => id.value ? `/landlord/model-pricings/${id.value}` : null
  return useSWRV(url, fetcher)
}

export function createModelPricing(payload: ModelPricingPayload) {
  return api.post('/landlord/model-pricings', payload)
}

export function editModelPricing(payload: ModelPricingPayload, id: number) {
  return api.put(`/landlord/model-pricings/${id}`, payload)
}

export function deleteModelPricing(id: number) {
  return api.delete(`/landlord/model-pricings/${id}`)
}
