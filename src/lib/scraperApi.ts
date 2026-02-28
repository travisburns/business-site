const SCRAPER_API_URL =
  process.env.NEXT_PUBLIC_SCRAPER_API_URL || "https://localhost:7094/api";

async function scraperFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token") || localStorage.getItem("access_token")
      : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${SCRAPER_API_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`Scraper API error: ${res.status}`);
  const json = await res.json();
  if (json && typeof json === "object" && "data" in json) return json.data as T;
  return json as T;
}

export interface ScrapingRequest {
  Niche: string;
  Location: string;
  TargetCount: number;
  SessionName?: string;
  DelayMin?: number;
  DelayMax?: number;
}

export interface ScrapingProgress {
  sessionId: number;
  status: number;
  currentPage: number;
  totalPages: number;
  progressPercentage: number;
  leadsFound: number;
  duplicatesSkipped: number;
  currentAction: string;
  isComplete?: boolean;
}

export interface ScrapedLead {
  id: number;
  businessName: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  address: string;
  website?: string;
  categories: string;
  industry?: string;
  rating?: number;
  city?: string;
  state?: string;
  conversionProbability?: number;
  status: number;
  isManaged?: boolean;
  estimatedRevenue?: number;
  assignedSalesperson?: string;
  score?: number;
}

interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export async function startScrapingSession(data: ScrapingRequest) {
  return scraperFetch<{ sessionId: number; message: string }>(
    "/LeadGeneration/start",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export async function getScrapingProgress(sessionId: number) {
  return scraperFetch<ScrapingProgress>(`/LeadGeneration/progress/${sessionId}`);
}

export async function getScrapedLeads(source = "YellowPages", limit = 100) {
  return scraperFetch<PagedResult<ScrapedLead>>(
    `/Leads/scraped/${source}?limit=${limit}`
  );
}

export async function importScrapedLead(scrapedLeadId: number) {
  return scraperFetch<{ leadId: number }>("/Leads/import", {
    method: "POST",
    body: JSON.stringify({ scrapedLeadId }),
  });
}
