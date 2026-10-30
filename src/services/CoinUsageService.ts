import useSWRV from "swrv"
import type { Ref } from "vue"

import fetcher from "./_fetcher"
import type { CoinUsageList } from "@/types/coin-usage"

export function getCoinUsageList(page: Ref<number>, limit: Ref<number>, search: Ref<string>) {
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

  const url = () => "/landlord/coin-usages?" + params()

  return useSWRV<CoinUsageList>(url, fetcher)
}
