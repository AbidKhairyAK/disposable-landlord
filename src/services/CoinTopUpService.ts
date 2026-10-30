import useSWRV from "swrv"
import type { Ref } from "vue"

import fetcher from "./_fetcher"
import api from "./_api"
import type { CoinTopUpList, CoinTopUpCreatePayload } from "@/types/coin-topup"

export function getCoinTopUpList(page: Ref<number>, limit: Ref<number>, search: Ref<string>) {
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

  const url = () => "/landlord/coin-top-ups?" + params()

  return useSWRV<CoinTopUpList>(url, fetcher)
}

export function createCoinTopUp(payload: CoinTopUpCreatePayload) {
  return api.post('/landlord/coin-top-ups', payload)
}
