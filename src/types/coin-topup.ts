import type { Meta } from "./meta"

export interface CoinTopUpList {
  data: CoinTopUp[]
  meta: Meta
}

export interface CoinTopUp {
  id         : number
  tenantId   : string
  tenantName : string
  amount     : number
  createdAt  : string
}

export interface CoinTopUpCreatePayload {
  tenant_id : string
  amount    : number
}
