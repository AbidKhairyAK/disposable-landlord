import useSWRV from "swrv"
import type { Ref } from "vue"

import fetcher from "./_fetcher"
import type { CoinRemainingList } from "@/types/coin-remaining"

export function getCoinRemainingList(page: Ref<number>, limit: Ref<number>, search: Ref<string>) {
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

  const url = () => "/landlord/coin-remainings?" + params()

  return useSWRV<CoinRemainingList>(url, fetcher)
}
