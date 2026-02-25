export interface Lead {
  leadId: number
  fullName: string
  email: string
  phone: string
  preferredContactMethod: string
  projectType: string
  location: string
  budgetRange: string
  timeline: string
  projectDescription: string
  status: string
  priority: string
  estimatedCostLow?: number
  estimatedCostHigh?: number
  createdAt: string
  lastContactedAt?: string
  contractorNotes?: string
}

export interface LeadCreateDto {
  fullName: string
  email: string
  phone: string
  preferredContactMethod: string
  projectType: string
  otherProjectDescription?: string
  location: string
  otherLocation?: string
  budgetRange: string
  timeline: string
  projectDescription: string
  propertyType?: string
  referralSource?: string
  pageSource?: string
  estimatedCostLow?: number
  estimatedCostHigh?: number
}

export interface LeadStats {
  totalLeads: number
  newLeads: number
  contactedLeads: number
  quotedLeads: number
  wonLeads: number
  lostLeads: number
  conversionRate: number
  totalRevenue: number
  averageLeadValue: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
  fullName: string
  email: string
  role: string
}