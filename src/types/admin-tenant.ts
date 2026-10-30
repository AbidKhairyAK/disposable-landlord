import type { Meta } from "./meta"

export interface AdminTenantCatalogProduct {
  key: string
  label: string
  featureKeys: string[]
}

export interface AdminTenantCatalogFeature {
  key: string
  label: string
  productKeys: string[]
}

export interface AdminTenantCatalog {
  products: AdminTenantCatalogProduct[]
  features: AdminTenantCatalogFeature[]
}

export interface AdminTenantList {
  data: AdminTenant[]
  meta: Meta
  catalog?: AdminTenantCatalog
}

export interface AdminTenantDefaultUser {
  name  : string,
  email : string,
  role  : 'admin' | 'instructor' | 'student',
}

export interface AdminTenant {
  id                : number,
  name              : string,
  tenantIdentifier  : string,
  maxUserTenants    : number,
  maxS3StorageGb    : number | null,
  databaseSchema    : string,
  isActive          : boolean,
  isMaintenance     : boolean,
  defaultUsers?     : AdminTenantDefaultUser[],
  isAiEnabled       : boolean,
  productKey        : string | null,
  enabledFeatureKeys: string[],
  zoomAccountMode    : 'alinnea',
  catalog?          : AdminTenantCatalog,
  createdAt	        : string,
  updatedAt	        : string,
}

export interface AdminTenantCreatePayload {	
  name              : string,
  tenantIdentifier  : string,
  maxUserTenants    : number|null,
  maxS3StorageGb    : number|null,
  isActive          : boolean,
  isMaintenance     : boolean,
  isAiEnabled       : boolean,
  productKey        : string | null,
  enabledFeatureKeys: string[],
  zoomAccountMode    : 'alinnea',
}

export interface AdminTenantFilter {
  search          : string,
}
