import type { Meta } from "./meta"

export interface CoinUsageList {
  data: CoinUsage[]
  meta: Meta
}

export interface CoinUsage {
  id              : number
  tenant_id       : string
  tenant_name     : string
  type            : string | null
  model           : string | null
  unit            : string | null
  input_quantity  : number | null
  output_quantity : number | null
  cost            : number | null
  currency        : string | null
  coinsUsed       : number | null
  createdAt       : string
}
