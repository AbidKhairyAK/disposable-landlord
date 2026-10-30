import type { Meta } from "./meta"

export interface ModelPricingList {
  data: ModelPricing[]
  meta: Meta
}

export interface ModelPricing {
  id                   : number
  model                : string
  type                 : string
  unit                 : string
  perUnits             : number
  inputPricePerUnit    : number
  outputPricePerUnit   : number | null
  currency             : string
  createdAt            : string
  updatedAt            : string
}

export interface ModelPricingPayload {
  model                 : string
  type                  : string
  unit                  : string
  per_units             : number
  input_price_per_unit  : number
  output_price_per_unit : number | null
  currency              : string
}
