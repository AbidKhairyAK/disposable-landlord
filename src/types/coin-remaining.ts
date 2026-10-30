import type { Meta } from "./meta"

export interface CoinRemainingList {
  data: CoinRemaining[]
  meta: Meta
}

export interface CoinRemaining {
  id         : number
  tenantId   : string
  tenantName : string
  amount     : number
  updatedAt  : string
}
