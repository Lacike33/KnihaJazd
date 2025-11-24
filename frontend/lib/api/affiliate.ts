import type { AffiliateStats, AffiliateReferral, AffiliateHistory, PartnerSettings } from "@/lib/types"
import { mockAffiliateApi } from "@/lib/mock-api"

export async function getAffiliateStats(userId: string): Promise<AffiliateStats> {
  return mockAffiliateApi.getStats(userId)
}

export async function getAffiliateReferrals(userId: string): Promise<AffiliateReferral[]> {
  return mockAffiliateApi.getReferrals(userId)
}

export async function getAffiliateHistory(userId: string): Promise<AffiliateHistory[]> {
  return mockAffiliateApi.getHistory(userId)
}

export async function getPartnerSettings(userId: string): Promise<PartnerSettings | null> {
  return mockAffiliateApi.getPartnerSettings(userId)
}

export async function updatePartnerSettings(
  userId: string,
  settings: Partial<PartnerSettings>,
): Promise<PartnerSettings> {
  return mockAffiliateApi.updatePartnerSettings(userId, settings)
}

export async function requestPayout(userId: string, amount: number): Promise<void> {
  return mockAffiliateApi.requestPayout(userId, amount)
}
