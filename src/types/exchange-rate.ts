import type { Meta } from "./meta"

export interface ExchangeRateList {
  data: ExchangeRate[]
  meta: Meta
}

export interface ExchangeRate {
  id            : number
  from_currency : string
  to_currency   : string
  rate          : number
  createdAt     : string
  updatedAt     : string
}

export interface ExchangeRatePayload {
  from_currency : string
  to_currency   : string
  rate          : number
}
